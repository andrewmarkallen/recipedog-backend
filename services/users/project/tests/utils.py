import json

from project.api.models import User, Recipe
from project import db
from flask import current_app


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

recipe_three_with_tags = {
    'title': 'apple royale',
    'description': 'apples royal style',
    'ingredients': '4 apples\n1 kg sugar',
    'method': 'boil apples in sugar for four weeks',
    'image': 'mushroom-toast.jpg',
    'url': 'www.google.com',
    'preptime': 45,
    'cooktime': 45,
    'serves': 4,
    'tags': 'apple, sweet, easy',
    'favourite': False
}

recipe_four_with_tags = {
    'title': 'clove rock',
    'description': 'clove flavour hard boiled sweets',
    'ingredients': 'sugar\nglucose syrup\nwater\ncolour',
    'method': 'boil syrup till hard',
    'image': 'mushroom-toast.jpg',
    'url': 'www.google.com',
    'preptime': 45,
    'cooktime': 45,
    'serves': 4,
    'tags': 'clove, candy, boiled',
    'favourite': False
}


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
                'email': email,
                'password': password,
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


def register_and_login(username='test', email='test@test.com'):
    # use username as password
    password = username
    add_user(username, email, password)
    response = login_user(email, password)
    token = json.loads(response.data.decode())['auth_token']
    return token


def decode_response(response):
    code = response.status_code
    data = {}
    try:
        data = json.loads(response.data.decode())
    except Exception as e:
        data = {'message': str(e)}
    return code, data
