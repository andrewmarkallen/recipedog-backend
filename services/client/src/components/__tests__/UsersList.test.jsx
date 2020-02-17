import React from 'react';
import { shallow } from 'enzyme';

import UsersList from '../UsersList';
import renderer from 'react-test-renderer'

const users = [
  {
    'active': true,
    'email': 'marka@example.com',
    'id': 1,
    'username': 'marka'
  },
  {
    'active': true,
    'email': 'yunwoo@example.com',
    'id': 2,
    'username': 'yunwoo'
  }
];

test('UserList renders properly', () => {
  const wrapper = shallow(<UsersList users={users}/>);
  const element = wrapper.find('h4');
  expect(element.length).toBe(2);
  expect(element.get(0).props.className).toBe('well');
  expect(element.get(0).props.children).toBe('marka');
});

test('UsersList renders a snapshot properly', () => {
  const tree = renderer.create(<UsersList users={users}/>).toJSON();
  expect(tree).toMatchSnapshot();
})
