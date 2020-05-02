import { Selector } from 'testcafe'
import { login } from './util'

const TEST_URL = process.env.TEST_URL
const randomstring = require('randomstring')

const title1 = randomstring.generate()
const title2 = randomstring.generate()

fixture('search').page(`${TEST_URL}/myrecipes`)

test(`should allow a user to search for recipes`, async(t)  => {
  // log in user
  await login(t, 'marka@example.com', 'sekrit')
  // add a new recipe
  await t
    .navigateTo(`${TEST_URL}/myrecipes`)
    .click(Selector('div[class="minicard addnew"]'))
    .typeText('input[name="title"]', title1)
    .typeText('input[name="tags"]', 'a1, b1')
    .typeText('input[name="description"]', 'c1 d1')
    .click(Selector('button[type="submit"]'))
  // new recipe shoud be displayed
  await t
    .navigateTo(`${TEST_URL}/myrecipes`)
    .click(Selector('div[class="minicard addnew"]'))
    .typeText('input[name="title"]', title2)
    .typeText('input[name="tags"]', 'a2, b2')
    .typeText('input[name="description"]', 'c2 d2')
    .click(Selector('button[type="submit"]'))
  // new recipe shoud be displayed
  await t
    .click(Selector('#navbar-search'))
    .typeText('#search', 'a1')
    .click(Selector('#search-button'))

  await t
    .expect(Selector('div[class="minicard-title"]').withText(title2).exists).notOk({timeout: 2000})
    .expect(Selector('div[class="minicard-title"]').withText(title1).exists).ok({timeout: 2000})


})
