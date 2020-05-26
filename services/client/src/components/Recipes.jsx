import React, { Component } from 'react'
import axios from 'axios'
import MiniCard, {AddRecipeCard} from './MiniCard'
import { Link } from 'react-router-dom'
import { get_recipe, search_recipes, get_recipes } from './Util.jsx'
import { Grid, Row } from 'react-bootstrap'

class Recipes extends Component {

  constructor (props) {
    super(props)
    this.state = {
      recipes: ['blank'],
      search: ''
    }
    this.getRecipes = this.getRecipes.bind(this)
    this.loadRecipes = this.loadRecipes.bind(this)
    this.searchRecipes = this.searchRecipes.bind(this)
  }

  componentDidMount() {
    if(this.props.location && this.props.location.search){
      this.setState({search : this.props.location.search}, this.loadRecipes)
    }
    else {
      this.loadRecipes()
    }
  }

  componentDidUpdate() {
    if(this.props.location && this.props.location.search) {
      if(this.state.search !== this.props.location.search) {
        this.setState({search : this.props.location.search}, this.loadRecipes)
      }
    }
  }

  loadRecipes() {
    if (this.props.isAuthenticated) {
      if(this.state.search) {
        this.searchRecipes(this.state.search)
      }
      else {
        this.getRecipes()
      }
    }
  }

  searchRecipes() {
    return axios(search_recipes((this.state.search)))
    .then((res) => {
      const ids = res.data.data
      this.setState({ recipes: []})
      ids.map(id  => axios(get_recipe(id))
        .then(res => {
          const recipe = res.data.data
          this.setState({ recipes: [...this.state.recipes, recipe] })
      }
      )
        .catch(e => console.log(e))
      )

    })
    .catch((error)  => {console.log(error)})
  }

  getRecipes() {
    const options = get_recipes()
    console.log(options)
    return axios(options)
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
      <div>
        { this.state.search && <h1>Search Results</h1> }
        { !this.state.search && <h1>My Recipes</h1>}
        <div id="my-recipes">

          <Grid><Row className="show-grid">
              <AddRecipeCard getRecipes={this.getRecipes}/>
              { this.state.recipes.reverse().map((recipe, index)  => {
                return <MiniCard key={index} recipe={recipe}
                updateRecipes={this.getRecipes} /> }) }
          </Row></Grid>
          {/* <DebugRecipeCards recipes={props.recipes}/> */}
        </div>
      </div>
    )
  }
}

export default Recipes
