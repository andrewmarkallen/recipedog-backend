import { Selector } from 'testcafe'

const TEST_URL = process.env.TEST_URL

async function register(t, username, email) {
  await t
  .navigateTo(`${TEST_URL}/register`)
  .typeText('input[name="username"]', username)
  .typeText('input[name="email"]', email)
  .typeText('input[name="password"]', 'test')
  .click(Selector('input[type="submit"]'))
}

export default register
