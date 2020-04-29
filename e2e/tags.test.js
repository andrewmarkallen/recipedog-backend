import { Selector } from 'testcafe'
import { login } from './util'

const randomstring = require('randomstring')
const title = randomstring.generate()

const TEST_URL = process.env.TEST_URL

fixture('tags').page(`${TEST_URL}/myrecipes`)

test(`should allow a user to edit tags`, async(t)  => {
  //log in user
  await login(t, 'marka@example.com', 'sekrit')
  //add a new recipe
  await t
    .navigateTo(`${TEST_URL}/myrecipes`)
    .click(Selector('div[class="minicard addnew"]'))
    .typeText('input[name="title"]', title)
    .typeText('input[name="description"]', 'desc')
    .typeText('input[name="tags"]', 'hot, lunch')
    .click(Selector('button[type="submit"]'))
  //new recipe should be displayed
  await t
    .click(Selector('div[class="minicard-title"]').withText(title))
    // .expect(Selector('span').withText(title).exists).ok()
    .expect(Selector('div').withText('hot').exists).ok()
    .expect(Selector('div').withText('lunch').exists).ok()

  await t
    .typeText('input[aria-controls="react-autowhatever-tagbox"]', 'dinner')
    .pressKey('enter')
    .click(Selector('div').withText('lunch').child('span'))

  await t
    .navigateTo(`${TEST_URL}/myrecipes`)
    .click(Selector('div[class="minicard-title"]').withText(title))
    .expect(Selector('div').withText('hot').exists).ok()
    .expect(Selector('div').withText('lunch').exists).notOk()
    .expect(Selector('div').withText('dinner').exists).ok()
})
