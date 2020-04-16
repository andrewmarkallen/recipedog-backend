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

  expect(wrapper.find('h1').get(0).props.children).toBe('My Recipes')
  // table
  const table = wrapper.find('Table')
  expect(table.length).toBe(1)
  expect(table.get(0).props.striped).toBe(true)
  expect(table.get(0).props.bordered).toBe(true)
  expect(table.get(0).props.condensed).toBe(true)
  expect(table.get(0).props.hover).toBe(true)
  // table head
  expect(wrapper.find('thead').length).toBe(1)
  const th = wrapper.find('th')
  expect(th.length).toBe(11)
  expect(th.get(0).props.children).toBe('Title')
  expect(th.get(1).props.children).toBe('Description')
  expect(th.get(2).props.children).toBe('Ingredients')
  expect(th.get(3).props.children).toBe('Instructions')
  expect(th.get(4).props.children).toBe('Image')
  expect(th.get(5).props.children).toBe('URL')
  // table body
  expect(wrapper.find('tbody').length).toBe(1)
  expect(wrapper.find('tbody > tr').length).toBe(2)
  const td = wrapper.find('tbody > tr > td')
  expect(td.length).toBe(22)
  expect(td.get(1).props.children).toBe(recipes[0]['description'])
  expect(td.get(2).props.children).toBe(recipes[0]['ingredients'])
  expect(td.get(3).props.children).toBe(recipes[0]['method'])
  expect(td.get(4).props.children.props.src).toContain(recipes[0]['image'])
  expect(td.get(5).props.children).toBe(recipes[0]['url'])

  const link = wrapper.find('Link')
  expect(link.length).toBe(2)
  expect(link.get(0).props.children).toBe(recipes[0]['title'])

  // Test tags are rendered properly
  const tags = wrapper.find('#tags')
  expect(tags.length).toBe(2)
})

test('UsersList renders a snapshot properly', ()  => {
  const tree = renderer.create(
    <MemoryRouter><RecipesList recipes={recipes}/></MemoryRouter>)
    .toJSON()
  expect(tree).toMatchSnapshot
})