
from project.tests.utils import add_recipe, add_user
from project.tests.base import BaseTestCase


class TestRecipeModel(BaseTestCase):

    def test_add_recipe(self):
        add_user('justatest', 'test@test.com', 'sekrit')
        recipe = add_recipe(1, 'stew', '1 tomato\n1 mushroom', 'boil\nserve')
        self.assertEqual(recipe.title, 'stew')
        self.assertEqual(recipe.ingredients, '1 tomato\n1 mushroom')
        self.assertEqual(recipe.method, 'boil\nserve')

    def test_add_tag(self):
        add_user('justatest', 'test@test.com', 'sekrit')
        recipe = add_recipe(1, 'stew', '1 tomato\n1 mushroom', 'boil\nserve')
        recipe.addTag('dinner')
        tags = [tag.name for tag in recipe.getTags()]
        self.assertEqual(len(tags), 1)
        self.assertEqual(tags[0], 'dinner')

    def test_add_two_same_tag(self):
        add_user('justatest', 'test@test.com', 'sekrit')
        recipe = add_recipe(1, 'stew', '1 tomato\n1 mushroom', 'boil\nserve')
        recipe.addTag('dinner')
        recipe.addTag('dinner')
        tags = [tag.name for tag in recipe.getTags()]
        self.assertEqual(len(tags), 1)
        self.assertEqual(tags[0], 'dinner')

    def test_add_two_different_tags(self):
        add_user('justatest', 'test@test.com', 'sekrit')
        recipe = add_recipe(1, 'stew', '1 tomato\n1 mushroom', 'boil\nserve')
        recipe.addTag('dinner')
        recipe.addTag('easy')
        tags = [tag.name for tag in recipe.getTags()]
        self.assertEqual(len(tags), 2)
        self.assertIn('dinner', tags)
        self.assertIn('easy', tags)

    def test_get_multiple_recipes_by_tag(self):
        add_user('justatest', 'test@test.com', 'sekrit')
        recipe1 = add_recipe(1, 'stew', '1 tomato\n1 mushroom', 'boil\nserve')
        recipe2 = add_recipe(1, 'soup', '1 onion\n1 carrot', 'make soup')
        recipe1.addTag('dinner')
        tag = recipe2.addTag('dinner')
        recipes = tag.getAllRecipes()
        self.assertEqual(len(recipes), 2)
        titles = [recipe.title for recipe in recipes]
        self.assertIn('stew', titles)
        self.assertIn('soup', titles)

    def test_get_multiple_recipes_same_user_only_by_tag(self):
        add_user('justatest1', 'test1@test.com', 'sekrit')
        add_user('justatest2', 'test2@test.com', 'sekrit')
        recipe1 = add_recipe(1, 'stew', '1 tomato\n1 mushroom', 'boil\nserve')
        recipe2 = add_recipe(1, 'soup', '1 onion\n1 carrot', 'make soup')
        recipe3 = add_recipe(2, 'toast', '1 bread\n1 butter', 'toast bread')
        recipe1.addTag('dinner')
        recipe2.addTag('dinner')
        tag = recipe3.addTag('dinner')
        recipes = tag.getAllRecipesByUserID(1)
        self.assertEqual(len(recipes), 2)
        titles = [recipe.title for recipe in recipes]
        self.assertIn('stew', titles)
        self.assertIn('soup', titles)
        self.assertNotIn('toast', titles)
