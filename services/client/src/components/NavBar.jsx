import React from 'react'
import { FormGroup, FormControl, Navbar, Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const NavBar = (props)  => (
  <Navbar inverse collapseOnSelect fixedTop={true}>

    <Navbar.Form pullLeft>
      <FormGroup>
        <FormControl type="text" placeholder="Search" className="mr-sm-1" />
      </FormGroup>
    </Navbar.Form>

    <Navbar.Header>
      <Navbar.Toggle pullright="true" />
    </Navbar.Header>
    { <Navbar.Brand>
      <span>{props.title}</span>
    </Navbar.Brand> }
    <Navbar.Collapse pullright="true">
      <Nav>
        <LinkContainer to="/">
          <NavItem eventKey={1}>Home</NavItem>
        </LinkContainer>
        {props.isAuthenticated &&
          <LinkContainer to="/myrecipes">
          <NavItem eventKey={2}>Recipes</NavItem>
        </LinkContainer>}
        <LinkContainer to="/about">
          <NavItem eventKey={3}>About</NavItem>
        </LinkContainer>
        {props.isAuthenticated &&
          <LinkContainer to="/status">
          <NavItem eventKey={4}>User Status</NavItem>
        </LinkContainer>}
        {!props.isAuthenticated &&
          <LinkContainer to="/register">
          <NavItem eventKey={1}>Register</NavItem>
        </LinkContainer>}
        {!props.isAuthenticated &&
          <LinkContainer to="/login">
          <NavItem eventKey={2}>Log In</NavItem>
        </LinkContainer>}
        {props.isAuthenticated &&
          <LinkContainer to="/logout">
          <NavItem eventKey={3}>Log Out</NavItem>
        </LinkContainer>}
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default NavBar
