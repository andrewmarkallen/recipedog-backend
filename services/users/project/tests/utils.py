import json

from project.api.models import User, Recipe
from project import db
from flask import current_app


def add_user(username, email, password):
    user = User(username=username, email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return user


def add_admin(username, email, password):
    user = User(
        username=username, email=email,
        password=password, admin=True)
    db.session.add(user)
    db.session.commit()
    return user


def login_user(email, password):
    with current_app.test_client() as client:
        response = client.post(
            '/auth/login',
            data=json.dumps({
                'email': 'test@test.com',
                'password': 'test',
            }),
            content_type='application/json'
        )
        return response


def add_recipe(owner, title, ingredients, method):
    recipe = Recipe(
        owner=owner, title=title, ingredients=ingredients, method=method)
    db.session.add(recipe)
    db.session.commit()
    return recipe


recipe_one_no_tags = {
    'title': 'curried fig',
    'description': 'fig curried with salt',
    'ingredients': '100g curry sauce mix\n100g butter\n5 figs',
    'method': 'melt butter\nmix sauce and butter\nadd figs',
    'image': 'rice-and-egg.jpg',
    'url': '',
    'preptime': 45,
    'cooktime': 45,
    'serves': 4,
    'favourite': True
    }

recipe_two_no_tags = {
    'title': 'beans on toast',
    'description': 'classic beans on toast',
    'ingredients': '1 tin beans\n1 tin toast',
    'method': 'pour both tins into mixing bowl\nheat for 35 minutes',
    'image': 'mushroom-toast.jpg',
    'url': 'www.google.com',
    'preptime': 45,
    'cooktime': 45,
    'serves': 4,
    'favourite': False
}

recipe_one_with_tags = {
    'title': 'curried fig',
    'description': 'fig curried with salt',
    'ingredients': '100g curry sauce mix\n100g butter\n5 figs',
    'method': 'melt butter\nmix sauce and butter\nadd figs',
    'image': 'rice-and-egg.jpg',
    'url': '',
    'preptime': 45,
    'cooktime': 45,
    'serves': 4,
    'tags': 'dinner, crowd-pleaser',
    'favourite': True
    }

recipe_two_with_tags = {
    'title': 'beans on toast',
    'description': 'classic beans on toast',
    'ingredients': '1 tin beans\n1 tin toast',
    'method': 'pour both tins into mixing bowl\nheat for 35 minutes',
    'image': 'mushroom-toast.jpg',
    'url': 'www.google.com',
    'preptime': 45,
    'cooktime': 45,
    'serves': 4,
    'tags': 'beans, breakfast, easy',
    'favourite': False
}
