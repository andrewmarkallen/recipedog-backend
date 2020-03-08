import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import Recipes from '../Recipes'
import renderer from 'react-test-renderer'

test('Recipes will call getRecipes when mounted', ()  => {
  const onGetRecipes = jest.fn()
  Recipes.prototype.getRecipes = onGetRecipes
  const wrapper = mount(<Router><Recipes isAuthenticated={true}/></Router>)
  expect(onGetRecipes).toHaveBeenCalledTimes(1)
})
