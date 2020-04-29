import React from 'react'
import { shallow, mount } from 'enzyme'

import RecipesList from '../RecipesList'
import renderer from 'react-test-renderer'
import {BrowserRouter, MemoryRouter} from 'react-router-dom'

const recipes = [
  {
  'id':0,
  'title' : 'curried fig',
  'description' : 'fig curried with salt',
  'ingredients' : '100g curry sauce mix\n100g butter\n5 figs',
  'method' : 'melt butter\nmix sauce and butter\nadd figs',
  'image' : 'rice-and-egg.jpg',
  'url' : ''
  },
  {
  'id':1,
  'title' : 'korean fig',
  'description' : 'fig in korean style',
  'ingredients' : '100g gochujang\n100g butter\n5 figs',
  'method' : 'melt butter\nmix gochujang and butter\nadd figs',
  'image' : 'rice-and-egg.jpg',
  'url' : ''
  }
]

test('RecipesList renders properly', ()  => {
  const wrapper = mount(<MemoryRouter><RecipesList recipes={recipes}/></MemoryRouter>)

  //todo rewrite
})

test('UsersList renders a snapshot properly', ()  => {
  const tree = renderer.create(
    <MemoryRouter><RecipesList recipes={recipes}/></MemoryRouter>)
    .toJSON()
  expect(tree).toMatchSnapshot
})
