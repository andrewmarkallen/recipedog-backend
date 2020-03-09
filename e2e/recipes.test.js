import { Selector } from 'testcafe'
import { login } from './util'

const randomstring = require('randomstring')

const username = randomstring.generate()
const email = `${username}@test.com`

const title = 'curried fig'
const description = 'fig curried with salt'
const ingredients = '100g curry sauce mix\n100g butter\n5 figs'
const method = 'melt butter\nmix sauce mix and butter\nadd figs'

const TEST_URL = process.env.TEST_URL

fixture('/myrecipes').page(`${TEST_URL}/myrecipes`)


test(`should display the add a recipe dropdown`, async (t)  => {

  await login(t, 'marka@example.com', 'sekrit')

  await t
    .navigateTo(`${TEST_URL}/myrecipes`)
    .expect(Selector('.dropdown').exists).ok()
    .expect(Selector('#id_recipe').withText("Add a Recipe!").exists).ok()
})

test(`existing recipes should be displayed in the my recipes`, async (t)  => {

  //log in user
  await login(t, 'yunwoo@example.com', 'sekrit')

  //see if database test recipe is still there
  await t.navigateTo(`${TEST_URL}/myrecipes`)

  const tableRow = Selector('td').withText('Egg on Rice').parent()
  await t.expect(tableRow.child().withText('Egg on Rice').exists).ok()
})

test(`should allow a user to add a recipe`, async(t)  => {
  //log in user
  await login(t, 'marka@example.com', 'sekrit')
  //add a new recipe
  await t
    .navigateTo(`${TEST_URL}/myrecipes`)
    .typeText('input[name="title"]', title)
    .typeText('input[name="description"]', description)
    .typeText('textarea[name="ingredients"]', ingredients)
    .typeText('textarea[name="method"]', method)
    .click(Selector('button[type="submit"]'))
  //new recipe should be displayed
  const tableRow = Selector('td').withText(title).parent()
  await t
    .expect(tableRow.child().withText(description).exists).ok()
    .expect(tableRow.child().withText(ingredients.split('\n')[0]).exists).ok()
    .expect(tableRow.child().withText(ingredients.split('\n')[1]).exists).ok()
    .expect(tableRow.child().withText(ingredients.split('\n')[2]).exists).ok()
    .expect(tableRow.child().withText(method.split('\n')[0]).exists).ok()
    .expect(tableRow.child().withText(method.split('\n')[1]).exists).ok()
    .expect(tableRow.child().withText(method.split('\n')[2]).exists).ok()
})
