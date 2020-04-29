import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { MemoryRouter as Router } from 'react-router-dom'

import NavBar from '../NavBar'

const title = 'Hello, World!'

test('NavBar renders properly', ()  => {

  //todo: rewrite test

})

test('NavBar renders a snapshot properly', ()  =>  {
  const tree = renderer.create(
    <Router location="/"><NavBar title={title}/></Router>
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
