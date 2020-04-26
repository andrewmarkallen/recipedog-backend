import React from 'react'
import { Button, FormGroup, FormControl, Navbar, Nav, NavItem, Modal } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const SearchButton = (props)  => {
  var looking_glass = "glyphicon glyphicon-search"
  return(
    <Navbar.Form pullRight>
      <Button
        id="navbar-search"
        onClick={()  => {}}
        className="pull-right">
        <span className={looking_glass} aria-hidden="true"></span>
      </Button>
    </Navbar.Form>
  )
}

const NavBar = (props)  => {

  const handleClick = ()  => {
    console.log("clickety")
    var x = document.getElementById("myTopnav");
      if (x.className === "fixed-nav-bar") {
        x.className += " responsive";
        console.log("adding")
      } else {
        x.className = "fixed-nav-bar";
      }
  }

  const handleSearch = ()  => {
    console.log('clickety')
    return(<Modal>Coming Soon</Modal>)
  }

  return(
    <nav className="fixed-nav-bar" id="myTopnav">
      <div>
      <a href="javascript:void(0);" className="icon" id="hamburger" onClick={handleClick}>
        <i className="glyphicon glyphicon-menu-hamburger"></i></a>
      <a href="javascript:void(0);" id="hamburger" onClick={handleClick}>
        <i className="glyphicon glyphicon-menu-hamburger"></i></a>
      <a href="/" className="active">Home</a>
      {props.isAuthenticated && <a href="/myrecipes" >Recipes</a> }
      <a href="/about">About</a>
      {props.isAuthenticated && <a href="/status">User Status</a>}
      {!props.isAuthenticated && <a href="/register">Register</a>}
      {!props.isAuthenticated && <a href="/login">Log In</a>}
      {props.isAuthenticated && <a href="/logout">Log Out</a>}

    </div>
      <div id="navbar-brand" onClick={()  => {console.log('clickety')}}>RecipeDog</div>
      <a href="javascript:void(0);" className="icon" onClick={handleSearch} id="navbar-search">
        <i className="glyphicon glyphicon-search"></i>
      </a>
    </nav>

  )
}

export default NavBar
