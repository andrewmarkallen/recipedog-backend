import { Selector } from 'testcafe'
import { login } from './util'

const randomstring = require('randomstring')

const username = randomstring.generate()
const email = `${username}@test.com`

const randomTitle = randomstring.generate()
const title = 'proper-curried-fig'
const description = 'fig with salt'
const ingredients = '100g curry mix\n100g butter\n5 figs'
const method = 'melt butter\nmix with sauce\nadd figs'
const preptime = '30'
const cooktime = '45'
const serves = '3'
const notes = 'salty'
const tagstring = 'dinner, fig, easy'
const tags = ['dinner', 'fig', 'easy']

const TEST_URL = process.env.TEST_URL

fixture('/myrecipes').page(`${TEST_URL}/myrecipes`)

test(`existing recipes should be displayed in the my recipes`, async (t)  => {

  //log in user
  await login(t, 'yunwoo@example.com', 'sekrit')

  //see if database test recipe is still there
  await t.navigateTo(`${TEST_URL}/myrecipes`)

  const selector = Selector('div[class="minicard-title"]').withText('Egg on Rice').parent()
  await t.expect(selector.exists).ok()
})

test(`should allow a user to add a recipe`, async(t)  => {
  //log in user
  await login(t, 'marka@example.com', 'sekrit')
  //add a new recipe
  await t
    .navigateTo(`${TEST_URL}/myrecipes`)
    .click(Selector('div[class="minicard addnew"]'))
    .typeText('input[name="title"]', randomTitle)
    .typeText('input[name="description"]', description)
    .typeText('textarea[name="ingredients"]', ingredients)
    .typeText('textarea[name="method"]', method)
    .typeText('input[name="preptime"]', preptime)
    .typeText('input[name="cooktime"]', cooktime)
    .typeText('input[name="serves"]', serves)
    .typeText('input[name="notes"]', notes)
    .typeText('input[name="tags"]', tagstring)
    .click(Selector('button[type="submit"]'))
  //new recipe should be displayed
  const re = new RegExp(randomTitle, "i")
  const el = Selector('div[class="minicard-title"]').withText(re)
  await t
    .expect(el.exists).ok()

  // Go through to the recipe card
  await t
    .click(el)
    .expect(Selector('span').withText(re).exists).ok()
})

test(`should allow a user to edit a recipe`, async(t)  => {

  // log in user
  await login(t, 'marka@example.com', 'sekrit')

  // recipe should still be there
  const link = Selector('div[class="minicard-title"]').withText(randomTitle)
  await t
    .navigateTo(`${TEST_URL}/myrecipes`)
    .expect(link.exists).ok()

  // Go through to recipe card
  const re = new RegExp(randomTitle, "i")
  await t
    .click(link)
    .expect(Selector('span').withText(re).exists).ok()

  // Attempt to edit the recipe
  await t.click(Selector('#edit-button'))
    .expect(Selector('#title-editable').exists).ok()
    .selectEditableContent('#title-editable')
    .pressKey('delete')
    .typeText('div[id="title-editable"]', title)
    .click('#done-editing')

  // See changes
  await t
    .navigateTo(`${TEST_URL}/myrecipes`)
    .expect(Selector('a').withText(title).exists).ok()

  // await t.eval(() => location.reload(true))
  //
  // await t
  //   .navigateTo(`${TEST_URL}/myrecipes`)
  //   .expect(Selector('a').withText(title))

  // Return to the MyRecipes page and see updated title there
})
