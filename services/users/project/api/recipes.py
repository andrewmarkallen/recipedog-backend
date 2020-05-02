from project.api.utils import (authenticate, response_success,
                               response_failure, delete_image)
from flask import Blueprint, request
from sqlalchemy import exc
from project.api.models import Recipe, Tag
from project import db
import re


recipes_blueprint = Blueprint('recipes', __name__,
                              template_folder='./templates')


@recipes_blueprint.route('/recipes', methods=['GET', 'POST'])
@authenticate
def recipes(resp):
    if request.method == 'POST':
        try:
            recipe = request.get_json()
            recipe['owner'] = resp
            record = Recipe(**recipe)
            db.session.add(record)
            db.session.commit()
            msg = f'{recipe} was added'
            return response_success(msg, 201, {'id': record.id})
        except exc.IntegrityError as e:
            db.session.rollback()
            return response_failure(str(e), 400)
    try:
        recipes = Recipe.query.filter_by(owner=int(resp)).all()
        data = list(map(Recipe.to_json, recipes))
        return response_success('added', 200, {'data': data})
    except Exception as e:
        return response_failure(str(e), 404)


valid_keys = ['title', 'description', 'ingredients',
              'method', 'image', 'url', 'preptime',
              'cooktime', 'serves', 'tags', 'favourite', 'notes'
              ]


@recipes_blueprint.route('/recipes/<recipe_id>/tag',
                         methods=['POST', 'DELETE'])
@authenticate
def post_tag(resp, recipe_id):
    if request.method == 'DELETE':
        try:
            recipe = Recipe.query.filter_by(id=recipe_id).scalar()
            if recipe is None:
                return response_failure('recipe does not exist', 404)
            tag = request.get_json()['tag']
            if recipe.deleteTag(tag) is None:
                return response_failure('tag does not exist', 404)
            return response_success('tag deleted', 200)
        except exc.IntegrityError as e:
            db.session.rollback()
            return response_failure(str(e), 404)
    try:
        recipe = Recipe.query.filter_by(id=recipe_id).scalar()
        if recipe is None:
            return response_failure('recipe does not exist', 404)
        tag = request.get_json()['tag']
        if recipe.addTag(tag) is None:
            return response_failure('tag already exists', 409)
        else:
            return response_success('tag added', 201)
    except Exception as e:
        return response_failure(str(e), 404)


@recipes_blueprint.route('/recipes/<recipe_id>', methods=['DELETE'])
@authenticate
def delete_recipe(resp, recipe_id):
    try:
        recipe = Recipe.query.filter_by(id=recipe_id).scalar()
        if recipe is None:
            return response_failure('recipe does not exist', 404)
        if recipe.owner != resp:
            return response_failure('action forbidden', 403)
        if recipe.image is not None:
            delete_image(recipe.image)
        db.session.delete(recipe)
        db.session.commit()
        return response_success('recipe deleted', 200)
    except exc.IntegrityError as e:
        db.session.rollback()
        return response_failure(str(e), 400)
    except Exception as e:
        return response_failure(str(e), 404)


@recipes_blueprint.route('/recipes/<recipe_id>',
                         methods=['GET', 'PUT', 'DELETE'])
@authenticate
def get_recipe(resp, recipe_id):
    if request.method == 'PUT':
        try:
            update = request.get_json()
            invalid_keys = [k for k in update.keys() if k not in valid_keys]
            if invalid_keys != []:
                return response_failure('parameter does not exist', 404)
            recipe = Recipe.query.filter_by(id=recipe_id).scalar()
            if recipe is None:
                return response_failure('recipe does not exist', 404)
            for key, value in update.items():
                setattr(recipe, key, value)
            db.session.commit()
            return response_success('recipe updated', 204)
        except exc.IntegrityError as e:
            db.session.rollback()
            return response_failure(str(e), 400)
    try:
        recipe = Recipe.query.filter_by(id=recipe_id).scalar()
        if recipe is None:
            return response_failure('recipe does not exist', 404)
        return response_success('recipe', 200, {'data': recipe.to_json()})
    except Exception as e:
        return response_failure(str(e), 404)


@recipes_blueprint.route('/recipes/<recipe_id>/tags', methods=['GET'])
@authenticate
def get_tags(resp, recipe_id):
    try:
        recipe = Recipe.query.filter_by(id=recipe_id).scalar()
        if recipe is None:
            return response_failure('recipe does not exist', 404)
        data = [tag.name for tag in recipe.getTags()]
        return response_success('success', 200, {'data': data})
    except Exception as e:
        return response_failure(str(e), 404)


@recipes_blueprint.route('/search', methods=['GET'])
@authenticate
def search_recipes(resp):

    def join_any(results):
        constituents = [x for y in results for x in y]
        return list(dict.fromkeys(constituents))

    def join_all(results):
        constituents = [x for y in results for x in y]
        finalresults = filter(lambda x: x_present_in_all_y(x, results),
                              constituents)
        return list(dict.fromkeys(finalresults))

    def x_present_in_all_y(constituent, results):
        truthArray = [constituent in y for y in results]
        presentInAll = False not in truthArray
        return presentInAll

    try:
        results = []
        fields = request.args.get('fields').split(',')
        search = request.args.get('search')
        mode = request.args.get('mode')
        search_terms = re.split(' |,|-', search)
        for term in search_terms:
            termResults = []
            expr = f'%{term}%'
            for field in fields:
                if field == 'title':
                    recipes = Recipe.query.filter(
                        Recipe.title.ilike(expr)).all()
                    termResults += [recipe.id for recipe in recipes]
                if field == 'description':
                    recipes = Recipe.query.filter(
                        Recipe.description.ilike(expr)).all()
                    termResults += [recipe.id for recipe in recipes]
                if field == 'tags':
                    tag = Tag.query.filter_by(name=term).scalar()
                    if tag is not None:
                        recipes = tag.getAllRecipesByUserID(resp)
                        termResults += [recipe.id for recipe in recipes]
            termResults = list(dict.fromkeys(termResults))
            results.append(termResults)
        if mode == 'any':
            results = join_any(results)
        else:
            results = join_all(results)
        return response_success('search results', 200, {'data': results})
    except Exception as e:
        print(str(e))
        return response_failure(str(e), 404)
