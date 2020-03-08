from project.api.utils import authenticate
from flask import Blueprint, jsonify, request
from sqlalchemy import exc
from project.api.models import Recipe, User
from project import db

recipes_blueprint = Blueprint('recipes', __name__,
                              template_folder='./templates')


@recipes_blueprint.route('/recipes', methods=['GET', 'POST'])
@authenticate
def recipes(resp):
    response_object = {
        'status': 'fail',
        'message': 'Invalid payload',
    }
    if request.method == 'POST':
        try:
            recipe = request.get_json()
            recipe['owner'] = resp
            db.session.add(Recipe(**recipe))
            db.session.commit()
            response_object['status'] = 'success'
            response_object['message'] = f'{recipe} was added'
            return jsonify(response_object), 201
        except exc.IntegrityError:
            db.session.rolllback()
            return jsonify(response_object), 400
        # except ValueError:
        #     return jsonify(response_object), 400
    try:
        # user_id = resp
        # user = User.query.filter_by(id=int(user_id)).first()
        # recipes = user.recipes.all()
        response_object = {
            'status': 'success',
            'data': recipes.to_json()
        }
        return jsonify(response_object), 200
    except:
        return jsonify(response_object), 404
