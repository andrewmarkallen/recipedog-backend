import json

from project.tests.base import BaseTestCase
from project.tests.utils import (add_user,
                                 login_user,
                                 recipe_one_no_tags,
                                 recipe_two_no_tags,
                                 recipe_one_with_tags
                                 )


class TestRecipesBlueprint(BaseTestCase):

    def test_post_recipes(self):
        add_user('test', 'test@test.com', 'test')
        response = login_user('test@test.com', 'test')
        token = json.loads(response.data.decode())['auth_token']
        response = self.post_recipe(token, recipe_one_no_tags)
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data['status'], 'success')

    def test_get_single_recipe_no_tags_after_created(self):
        # register and log in
        add_user('test', 'test@test.com', 'test')
        response = login_user('test@test.com', 'test')
        token = json.loads(response.data.decode())['auth_token']
        # post a recipe and then retrieve all recipes
        response = self.post_recipe(token, recipe_one_no_tags)
        self.assertEqual(response.status_code, 201)
        response = self.get_recipes(token)
        self.assertEqual(response.status_code, 200)
        # check if data returned matches what we saved
        data = json.loads(response.data.decode())
        recipe = data['data'][0]
        for key in recipe_one_no_tags.keys():
            self.assertEqual(recipe[key], recipe_one_no_tags[key])

    def test_get_multiple_recipes_no_tags(self):
        # register and log in
        add_user('test', 'test@test.com', 'test')
        response = login_user('test@test.com', 'test')
        token = json.loads(response.data.decode())['auth_token']
        # post two different recipes and then retrieve all recipes
        self.post_recipe(token, recipe_one_no_tags)
        self.post_recipe(token, recipe_two_no_tags)
        response = self.get_recipes(token)
        self.assertEqual(response.status_code, 200)
        # check if data returned matches what we saved
        data = json.loads(response.data.decode())
        recipe_one_data = data['data'][0]
        recipe_two_data = data['data'][1]
        for key in recipe_one_no_tags.keys():
            self.assertEqual(recipe_one_data[key], recipe_one_no_tags[key])
            self.assertEqual(recipe_two_data[key], recipe_two_no_tags[key])

    def test_get_single_recipe(self):
        # register and log in
        add_user('test', 'test@test.com', 'test')
        response = login_user('test@test.com', 'test')
        token = json.loads(response.data.decode())['auth_token']
        # post a recipe and then retrieve it
        response = self.post_recipe(token, recipe_one_no_tags)
        response = self.get_recipe(token, 1)
        self.assertEqual(response.status_code, 200)
        recipe = json.loads(response.data.decode())['data']
        for key in recipe_one_no_tags.keys():
            self.assertEqual(recipe[key], recipe_one_no_tags[key])

    def test_get_recipe_with_tags_after_created(self):
        # register and log in
        add_user('test', 'test@test.com', 'test')
        response = login_user('test@test.com', 'test')
        token = json.loads(response.data.decode())['auth_token']
        # post a recipe and then retrieve all recipes
        response = self.post_recipe(token, recipe_one_with_tags)
        self.assertEqual(response.status_code, 201)
        response = self.get_recipes(token)
        self.assertEqual(response.status_code, 200)
        # check if data returned matches what we saved
        data = json.loads(response.data.decode())
        recipe = data['data'][0]
        for key in recipe_one_no_tags.keys():
            # no tags is NOT a typo, no tags in response
            #  tags must be retrieved separately afterwards
            self.assertEqual(recipe[key], recipe_one_no_tags[key])
        response = self.get_tags(token, recipe['id'])
        self.assertEqual(response.status_code, 200)
        tags = json.loads(response.data.decode())['data']
        self.assertEqual(len(tags), 2)
        self.assertIn('crowd-pleaser', tags)
        self.assertIn('dinner', tags)

    def get_recipe(self, token, recipe_id):
        with self.client:
            response = self.client.get(
                f'/recipes/{recipe_id}',
                headers={'Authorization': f'Bearer {token}'}
            )
            return response

    def get_tags(self, token, recipe_id):
        with self.client:
            response = self.client.get(
                f'/recipes/{recipe_id}/tags',
                headers={'Authorization': f'Bearer {token}'}
            )
            return response

    def get_recipes(self, token):
        with self.client:
            response = self.client.get(
                '/recipes',
                headers={'Authorization': f'Bearer {token}'}
            )
            return response

    def post_recipe(self, token, recipe):
        with self.client:
            response = self.client.post(
                '/recipes',
                headers={'Authorization': f'Bearer {token}'},
                data=json.dumps(recipe),
                content_type='application/json'
            )
            return response
