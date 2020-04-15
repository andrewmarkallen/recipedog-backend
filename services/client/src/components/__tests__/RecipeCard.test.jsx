import React from 'react'
import { shallow, mount } from 'enzyme'
import RecipeCard from '../RecipeCard'

const recipe = {
  'cooktime': 25,
  'date': "Sat, 14 Mar 2020 02:04:03 GMT",
  'description': "mushroom on toast",
  'favourite': true,
  'id': 10,
  'image': "56046a6319ae4e20bd67bfbf371a1783.jpg",
  'ingredients': "mushrooms,\ntoast,\npepper",
  'method': "toast bread\nfry mushrooms\ngrind pepper",
  'notes': "for experts only",
  'preptime': 45,
  'serves': 7,
  'title': "Mushroom Toast",
  'url': ""
}

const tags = ['fake', 'inedible']

const state = {
  recipe: recipe,
  tags: tags
}

const location = { state: state }

test('RecipeCard renders succesfully', ()  => {
  const wrapper = mount(<RecipeCard location={location}/>)
  expect(wrapper.contains(<span id="title">Mushroom Toast</span>)).toEqual(true)
})
