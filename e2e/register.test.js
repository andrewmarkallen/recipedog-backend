import { Selector } from 'testcafe'
import {register} from './util'

const randomstring = require('randomstring')

const username = randomstring.generate()
const email = `${username}@test.com`

const TEST_URL = process.env.TEST_URL
fixture('/register').page(`${TEST_URL}/register`)

test(`should display the registration form`, async (t)  => {
  await t
    .navigateTo(`${TEST_URL}/register`)
    .expect(Selector('H1').withText('Register').exists).ok()
    .expect(Selector('form').exists).ok()
    .expect(Selector('input[disabled]').exists).ok()
    .expect(Selector('.validation-list').exists).ok()
    .expect(Selector('.validation-list > .error').nth(0).withText(
      'Username must be greater than 5 characters.'
      ).exists).ok()
})

test(`should allow a user to register`, async (t)  => {

  //register user
  await register(t, username, email)

  // assert user is redirected to '/'
  // assert '/' is displayed properly
  await t
    .expect(Selector('a').withText('Log Out').exists).ok()
    .expect(Selector('a').withText('Register').exists).notOk()
    .expect(Selector('a').withText('Log In').exists).notOk()
})

test(`should validate the password field`, async(t) => {
  await t
    .navigateTo(`${TEST_URL}/register`)
    .expect(Selector('H1').withText('Register').exists).ok()
    .expect(Selector('form').exists).ok()
    .expect(Selector('input[disabled]').exists).ok()
    .expect(Selector('.validation-list > .error').nth(3).withText(
      'Password must be greater than 10 characters'
      ).exists).ok()
    .typeText('input[name="password"]', 'greaterthanten')
    .expect(Selector('.validation-list').exists).ok()
    .expect(Selector('.validation-list > .error').nth(3).withText(
      'Password must be greater than 10 characters.'
      ).exists).notOk()
    .expect(Selector('.validation-list > .success').nth(0).withText(
      'Password must be greater than 10 characters.'
      ).exists).ok()
    .click(Selector('#hamburger'))
    await t
    .click(Selector('a').withText('LOG IN'))
    .click(Selector('#hamburger'))
    await t
    .click(Selector('a').withText('REGISTER'))
    .expect(Selector('.validation-list > .error').nth(3).withText(
      'Password must be greater than 10 characters.'
      ).exists).ok()
})
