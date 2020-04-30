import { Selector } from 'testcafe'
import { login } from './util'

const TEST_URL = process.env.TEST_URL
const randomstring = require('randomstring')

const title = randomstring.generate()

fixture('tags').page(`${TEST_URL}/myrecipes`)

test(`should allow a user to delete recipes`, async(t)  => {
  //log in user
  await login(t, 'marka@example.com', 'sekrit')
  //add a new recipe
  await t
    .navigateTo(`${TEST_URL}/myrecipes`)
    .click(Selector('div[class="minicard addnew"]'))
    .typeText('input[name="title"]', title)
    .click(Selector('button[type="submit"]'))
  //new recipe should be displayed
  await t
    .hover(Selector('div[class="minicard-title"]').withText(title))
    .click(Selector('#minicard-delete'))
    .click(Selector('#del-buttons-primary'))
  //recipe should be gone
  await t
    .expect(Selector('div[class="minicard-title"]').withText(title).exists).notOk({timeout: 10000})
})
