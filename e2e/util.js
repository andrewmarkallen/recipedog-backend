import { Selector } from 'testcafe'

const TEST_URL = process.env.TEST_URL

export async function register(t, username, email) {
  await t
  .navigateTo(`${TEST_URL}/register`)
  .typeText('input[name="username"]', username)
  .typeText('input[name="email"]', email)
  .typeText('input[name="password"]', 'greaterthanten')
  .click(Selector('input[type="submit"]'))
}

export async function login(t, email, password) {
  await t
  .navigateTo(`${TEST_URL}/login`)
  .typeText('input[name="email"]', email)
  .typeText('input[name="password"]', password)
  .click(Selector('input[type="submit"]'))
}
