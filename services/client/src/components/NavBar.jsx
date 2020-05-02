import React, { Component, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, ButtonToolbar, FormControl,  Glyphicon, FormGroup, InputGroup, Modal, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import queryString from 'query-string'

class SearchModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fields: ['title', 'tags', 'description'],
      searchString: '',
      query: '',
      mode: 'any',
      redirect: false
    }
  this.handleSearch = this.handleSearch.bind(this)
  this.handleSearchString = this.handleSearchString.bind(this)
  this.handleSearchFields  = this.handleSearchFields.bind(this)
  this.handleModeButton = this.handleModeButton.bind(this)
  }

  handleSearch() {
    this.setState( { query: queryString.stringify(
      {
        search: this.state.searchString,
        fields: this.state.fields.join(','),
        mode: this.state.mode
      }
    )})
    this.setState({redirect : true})
    this.props.handleCloseSearch()
    this.setState({searchString : ''})
  }

  handleModeButton(e) {
    this.setState({ mode: e })
  }

  handleSearchString(e) {
    this.setState({ searchString: e.target.value })
  }

  handleSearchFields(e) {
    this.setState({ fields: e })
  }

  render() {
    return(
    <div className="name">
      { (this.state.redirect) && <Redirect to={
        {
          pathname: "/myrecipes",
          search: this.state.query
        }
      }/>}
      <Modal id="search-modal" show={this.props.show} onHide={this.props.handleCloseSearch}>
        <Modal.Header closeButton id="search-header">
          <h1>Search for recipes</h1>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>

            <ButtonToolbar>
              <ToggleButtonGroup type="radio" name="options"
                defaultValue={'all'} onChange={this.handleModeButton}
              >
                <ToggleButton value={'all'}>All terms</ToggleButton>
                <ToggleButton value={'any'}>Any terms</ToggleButton>
              </ToggleButtonGroup>
            </ButtonToolbar>

            <InputGroup className="search-group">

              <FormControl autoFocus bsSize="large" type="text" id="search"
                placeholder="enter search terms..."
                onChange={this.handleSearchString}
                onKeyPress={(e) => {e.key === 'Enter' && this.handleSearch()}}
              />
              <InputGroup.Button>
                  <Button id="search-button" type="submit" bsSize="large" onClick={this.handleSearch}>
                    <Glyphicon glyph="search"/>
                  </Button>
              </InputGroup.Button>

            </InputGroup>

            <ToggleButtonGroup className="search-button" type="checkbox"
              value={this.state.fields} onChange={this.handleSearchFields}>

              <ToggleButton value={'title'}>title</ToggleButton>
              <ToggleButton value={'tags'}>tags</ToggleButton>
              <ToggleButton value={'description'}>description</ToggleButton>
              <ToggleButton value={'ingredients'}>ingredients</ToggleButton>

            </ToggleButtonGroup>

          </FormGroup>
        </Modal.Body>
      </Modal>
    </div>
    )
  }
}

const NavBar = (props)  => {

  const[redirect, setRedirect] = useState(false)
  const[showSearch, setShowSearch] = useState(false)

  const handleClick = ()  => {
    var x = document.getElementById("myTopnav")
    if (x.className === "fixed-nav-bar") {
      x.className += " responsive"
    } else {
      x.className = "fixed-nav-bar"
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
