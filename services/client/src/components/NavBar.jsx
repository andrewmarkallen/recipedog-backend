import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, FormControl, Glyphicon, FormGroup, InputGroup, Modal } from 'react-bootstrap'

const SearchModal = (props)  => {

  return(
      <Modal id="search-modal" show={props.show} onHide={props.handleCloseSearch}>
      <Modal.Header closeButton id="search-header">
        <h1>Search by title and tags</h1>
      </Modal.Header>
      <Modal.Body>
        <FormGroup>
          <InputGroup classname="search-group">
            <FormControl bsSize="large" type="text" placeholder="enter search terms..."/>
            <InputGroup.Button>
              <Button bsSize="large"><Glyphicon glyph="search"/></Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </Modal.Body>
    </Modal>
  )
}

const NavBar = (props)  => {

  const[redirect, setRedirect] = useState(false)
  const[showSearch, setShowSearch] = useState(false)

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

  const handleCloseSearch = () => { setShowSearch(false)}


  return(
    <div>
      { redirect && <Redirect to="/"/> }
      <SearchModal show={showSearch} handleCloseSearch={handleCloseSearch}/>
      <nav className="fixed-nav-bar" id="myTopnav">
        <div>
        <button className="icon" id="hamburger" onClick={handleClick}>
          <i className="glyphicon glyphicon-menu-hamburger"></i></button>
        <button id="hamburger" onClick={handleClick}>
          <i className="glyphicon glyphicon-menu-hamburger"></i></button>
        <a href="/" className="active">Home</a>
        {props.isAuthenticated && <a href="/myrecipes" >Recipes</a> }
        <a href="/about">About</a>
        {props.isAuthenticated && <a href="/status">User Status</a>}
        {!props.isAuthenticated && <a href="/register">Register</a>}
        {!props.isAuthenticated && <a href="/login">Log In</a>}
        {props.isAuthenticated && <a href="/logout">Log Out</a>}

      </div>
        <div id="navbar-brand" onClick={()=>setRedirect(true)}> RecipeDog</div>
        <button className="icon" onClick={()=>setShowSearch(true)} id="navbar-search">
          <i className="glyphicon glyphicon-search"></i>
        </button>
      </nav>
    </div>

  )
}

export default NavBar
