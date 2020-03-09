import json

from project.tests.base import BaseTestCase
from project.tests.utils import add_user, login_user


class TestRecipesBlueprint(BaseTestCase):

    recipe_one = {
            'title': 'curried fig',
            'description': 'fig curried with salt',
            'ingredients': '100g curry sauce mix\n100g butter\n5 figs',
            'method': 'melt butter\nmix sauce and butter\nadd figs',
            'image': 'rice-and-egg.jpg',
            'url': ''
        }

    recipe_two = {
        'title': 'beans on toast',
        'description': 'classic beans on toast',
        'ingredients': '1 tin beans\n1 tin toast',
        'method': 'pour both tins into mixing bowl\nheat for 35 minutes',
        'image': 'mushroom-toast.jpg',
        'url': 'www.google.com'
    }

    def test_post_recipes(self):
        add_user('test', 'test@test.com', 'test')
        response = login_user('test@test.com', 'test')
        token = json.loads(response.data.decode())['auth_token']
        response = self.post_recipe(token, self.recipe_one)
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data['status'], 'success')

    def test_get_single_recipe_after_created(self):
        # register and log in
        add_user('test', 'test@test.com', 'test')
        response = login_user('test@test.com', 'test')
        token = json.loads(response.data.decode())['auth_token']
        # post a recipe and then retrieve all recipes
        self.post_recipe(token, self.recipe_one)
        response = self.get_recipes(token)
        self.assertEqual(response.status_code, 200)
        # check if data returned matches what we saved
        data = json.loads(response.data.decode())
        recipe = data['data'][0]
        for key in self.recipe_one.keys():
            self.assertEqual(recipe[key], self.recipe_one[key])

    def test_get_multiple_recipes(self):
        # register and log in
        add_user('test', 'test@test.com', 'test')
        response = login_user('test@test.com', 'test')
        token = json.loads(response.data.decode())['auth_token']
        # post two different recipes and then retrieve all recipes
        self.post_recipe(token, self.recipe_one)
        self.post_recipe(token, self.recipe_two)
        response = self.get_recipes(token)
        self.assertEqual(response.status_code, 200)
        # check if data returned matches what we saved
        data = json.loads(response.data.decode())
        recipe_one = data['data'][0]
        recipe_two = data['data'][1]
        for key in self.recipe_one.keys():
            self.assertEqual(recipe_one[key], self.recipe_one[key])
            self.assertEqual(recipe_two[key], self.recipe_two[key])

    def get_recipes(self, token):
        with self.client:
            response = self.client.get(
                '/recipes',
                headers={'Authorization': f'Bearer {token}'}
            )
            return response

    def post_recipe(self, token, recipe):
        # recipe = json.dumps({
        #     'title': 'curried fig',
        #     'description': 'fig curried with salt',
        #     'ingredients': '100g curry sauce mix\n100g butter\n5 figs',
        #     'method': 'melt butter\nmix sauce and butter\nadd figs',
        #     'image': 'rice-and-egg.jpg',
        #     'url': ''
        # })
        with self.client:
            response = self.client.post(
                '/recipes',
                headers={'Authorization': f'Bearer {token}'},
                data=json.dumps(recipe),
                content_type='application/json'
            )
            return response
