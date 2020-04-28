import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import RecipesList from './RecipesList'
import { get_recipes } from './Util.jsx'

class Recipes extends Component {
  constructor (props) {
    super(props)
    this.state = {
      recipes: ['blank'],
    }
    this.getRecipes = this.getRecipes.bind(this)
  }

  componentDidMount() {
    if (this.props.isAuthenticated)
      {this.getRecipes()}
  }

  getRecipes() {
    return axios(get_recipes())
    .then((res) => { this.setState({ recipes: res.data.data }) })
    .catch((error)  => {console.log(error)})
  }

  render() {
    if (!this.props.isAuthenticated) {
      return (
        <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>
      )
    }
    return (
      <div id="my-recipes">
        <RecipesList
          recipes={this.state.recipes}
          getRecipes={this.getRecipes}
          isAuthenticated={this.props.isAuthenticated}
        />
      </div>
    )
  }
}

export default Recipes
