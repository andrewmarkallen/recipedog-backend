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
        token = self.register_and_login()
        response = self.post_recipe(token, recipe_one_no_tags)
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data['status'], 'success')

    def test_get_single_recipe_no_tags_after_created(self):
        # register and log in
        token = self.register_and_login()
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
        token = self.register_and_login()
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
        token = self.register_and_login()
        # post a recipe and then retrieve it
        response = self.post_recipe(token, recipe_one_no_tags)
        response = self.get_recipe(token, 1)
        self.assertEqual(response.status_code, 200)
        recipe = json.loads(response.data.decode())['data']
        for key in recipe_one_no_tags.keys():
            self.assertEqual(recipe[key], recipe_one_no_tags[key])

    def test_get_recipe_with_tags_after_created(self):
        [recipe_id, token] = self.register_login_and_post_recipe()
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

    def test_can_edit_recipe_title(self):
        update = {'title': 'pig stew'}
        [recipe_id, token] = self.register_login_and_post_recipe()
        # attempt to edit the recipe
        response = self.put_update(token, recipe_id, update)
        self.assertEqual(response.status_code, 204)
        # get the recipe again
        response = self.get_recipe(token, recipe_id)
        self.assertEqual(response.status_code, 200)
        # see if the title has been updated
        recipe = json.loads(response.data.decode())['data']
        self.assertEqual(recipe['title'], 'pig stew')

    def test_editing_non_existent_parameters(self):
        update = {'fake-param': 'does not exist'}
        [recipe_id, token] = self.register_login_and_post_recipe()
        # attempt to edit the recipe
        response = self.put_update(token, recipe_id, update)
        # should receive meaningful response
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data.decode())
        self.assertEqual(data['message'], 'parameter does not exist')

    def test_can_edit_multiple_parameters(self):
        update = {
            'title': 'pig stew',
            'cooktime': 13,
            'ingredients': 'new ingredients',
            'method': 'new method'
        }
        [recipe_id, token] = self.register_login_and_post_recipe()
        # attempt to edit the recipe
        response = self.put_update(token, recipe_id, update)
        self.assertEqual(response.status_code, 204)
        # get the recipe again
        response = self.get_recipe(token, recipe_id)
        self.assertEqual(response.status_code, 200)
        # see if the title has been updated
        recipe = json.loads(response.data.decode())['data']
        self.assertEqual(recipe['title'], 'pig stew')
        self.assertEqual(recipe['cooktime'], 13)
        self.assertEqual(recipe['ingredients'], 'new ingredients')
        self.assertEqual(recipe['method'], 'new method')

    def test_fails_gracefully_when_mix_of_valid_and_invalid_edits(self):
        update = {
            'title': 'pig stew',
            'cooktime': 13,
            'ingredients': 'new ingredient',
            'method': 'new method',
            'FAILY': 'i should stop rest from passing'
        }
        [recipe_id, token] = self.register_login_and_post_recipe()
        # attempt to edit the recipe
        response = self.put_update(token, recipe_id, update)
        self.assertEqual(response.status_code, 404)
        # get the recipe again
        response = self.get_recipe(token, recipe_id)
        self.assertEqual(response.status_code, 200)
        # make sure all old values are still there, 'update' did nothing
        recipe = json.loads(response.data.decode())['data']

        for key in recipe_one_no_tags.keys():
            # no tags is NOT a typo, no tags in response
            #  tags must be retrieved separately afterwards
            self.assertEqual(recipe[key], recipe_one_no_tags[key])

    def test_tags_api_add_tag(self):
        [recipe_id, token] = self.register_login_and_post_recipe()
        # attempt to add a new tag
        response = self.post_tag(token, recipe_id, 'new_tag')
        self.assertEqual(response.status_code, 201)
        # check that tag was added
        response = self.get_tags(token, recipe_id)
        tags = json.loads(response.data.decode())['data']
        self.assertIn('new_tag', tags)

    def test_tags_api_delete_tag(self):
        [recipe_id, token] = self.register_login_and_post_recipe()
        # try and delete a tag
        response = self.delete_tag(token, recipe_id, 'dinner')
        self.assertEqual(response.status_code, 200)
        # check tag was deleted
        response = self.get_tags(token, recipe_id)
        tags = json.loads(response.data.decode())['data']
        self.assertNotIn('dinner', tags)
        self.assertIn('crowd-pleaser', tags)
        self.assertEqual(1, len(tags))

    def test_tags_api_delete_nonexistent_tag(self):
        [recipe_id, token] = self.register_login_and_post_recipe()
        # try and delete a tag
        response = self.delete_tag(token, recipe_id, 'dinnnnnnner')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data.decode())
        self.assertEqual(data['message'], 'tag does not exist')
        # check nothing was deleted
        response = self.get_tags(token, recipe_id)
        tags = json.loads(response.data.decode())['data']
        self.assertIn('dinner', tags)
        self.assertIn('crowd-pleaser', tags)
        self.assertEqual(2, len(tags))

    def test_tags_api_add_already_existing_tag(self):
        # register and log in
        token = self.register_and_login()
        # post a new recipe
        response = self.post_recipe(token, recipe_one_with_tags)
        self.assertEqual(response.status_code, 201)
        recipe_id = json.loads(response.data.decode())['id']
        # attempt to add a new tag
        response = self.post_tag(token, recipe_id, 'new_tag')
        self.assertEqual(response.status_code, 201)
        # check that tag was added
        response = self.get_tags(token, recipe_id)
        tags = json.loads(response.data.decode())['data']
        self.assertIn('new_tag', tags)
        self.assertEqual(3, len(tags))
        # try to re-add tag
        response = self.post_tag(token, recipe_id, 'new_tag')
        self.assertEqual(response.status_code, 409)
        # check we still only have three tags
        response = self.get_tags(token, recipe_id)
        tags = json.loads(response.data.decode())['data']
        self.assertIn('new_tag', tags)
        self.assertEqual(3, len(tags))

    # def test_can_delete_recipe(self):
    #     # post a new recipe
    #     id = self.register_login_and_post_recipe()

    def put_update(self, token, recipe_id, update):
        with self.client:
            response = self.client.put(
                f'/recipes/{recipe_id}',
                headers={'Authorization': f'Bearer {token}'},
                data=json.dumps(update),
                content_type='application/json'
            )
            return response

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

    def post_tag(self, token, recipe_id, tag):
        with self.client:
            response = self.client.post(
                f'/recipes/{recipe_id}/tag',
                headers={'Authorization': f'Bearer {token}'},
                data=json.dumps({"tag": tag}),
                content_type='application/json'
            )
            return response

    def delete_tag(self, token, recipe_id, tag):
        with self.client:
            response = self.client.delete(
                f'/recipes/{recipe_id}/tag',
                headers={'Authorization': f'Bearer {token}'},
                data=json.dumps({"tag": tag}),
                content_type='application/json'
            )
            return response

    def register_and_login(self):
        add_user('test', 'test@test.com', 'test')
        response = login_user('test@test.com', 'test')
        token = json.loads(response.data.decode())['auth_token']
        return token

    def register_login_and_post_recipe(self):
        token = self.register_and_login()
        response = self.post_recipe(token, recipe_one_with_tags)
        recipe_id = json.loads(response.data.decode())['id']
        return recipe_id, token
