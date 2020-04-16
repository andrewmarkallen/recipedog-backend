import React, { Component } from 'react'
import { Button, ControlLabel, DropdownButton, FormControl, FormGroup, MenuItem } from 'react-bootstrap'
import axios from 'axios'
import { Link } from 'react-router-dom'
import RecipesList from './RecipesList'
import ImageDropzone from './ImageDropzone'
import { recipes_url } from './Util.jsx'

class Recipes extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: {
        title: '',
        description: '',
        ingredients: '',
        method: '',
        url: '',
        image: '',
        preptime: '',
        cooktime: '',
        serves: '',
        notes: '',
        tags: '',
      },
      recipes: ['todo'],
      formType: 'manual',
      promise: Promise.resolve(),
    }
    this.addRecipeSelector = this.addRecipeSelector.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
    this.setState = this.setState.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  componentDidMount() {
    if (this.props.isAuthenticated)
      {this.getRecipes()}
  }

  getRecipes() {
    const options = {
      url: recipes_url,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.authToken}`
      }
    }
    return axios(options)
    .then((res)  => { this.setState({ recipes: res.data.data })})
    .catch((error)  => {console.log(error)})
  }

  addRecipeSelector(eventKey) {
    this.setState({
      formType: eventKey
    })
  }

  clearForm(eventKey) {
    this.setState({
      formData: {
        title: '',
        description: '',
        ingredients: '',
        method: '',
        url: '',
        image: '',
        preptime: '',
        cooktime: '',
        serves: '',
        notes: '',
        tags: '',
      },
      formType: 'manual',
    })
  }

  handleFormChange(event) {
    const obj = this.state.formData
    obj[event.target.name] = event.target.value
    this.setState(obj)
  }

  handleSubmit(event) {
    alert('react dropzone upload submit handler')
  }

  async handleFormSubmit(event) {
    event.preventDefault()
      // if we're uploading a file we need to wait for the image to be uploaded,
      // and if we're not uploading an image, promise should be resolved
    await this.state.promise
    const options = {
      url: recipes_url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.authToken}`,
      },
      data: this.state.formData

    }
    axios(options).then(()  => {this.getRecipes()})
  }

  render() {
    if (!this.props.isAuthenticated) {
      return (
        <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>
      )
    }
    return (
      <div>
        <div className="dropdown">
          <DropdownButton
            bsStyle={`primary`}
            title={`Add a Recipe!`}
            key={1}
            id={`id_recipe`}>
              <MenuItem eventKey="fromURL" onSelect={this.addRecipeSelector}>
                From URL
              </MenuItem>
              <MenuItem eventKey="manual" onSelect={this.addRecipeSelector}>
                Manually
              </MenuItem>
          </DropdownButton>
        </div>
        <div className="form-group">
          {this.state.formType === 'fromURL' &&
          <div>coming soon</div>
          }
          {this.state.formType === 'manual' &&
          <form onSubmit={(event)  => this.handleFormSubmit(event)}>
            <FormGroup>
              <ControlLabel>Recipe Title</ControlLabel>
              <FormControl
                type="text"
                value={this.state.formData.title}
                name="title"
                placeholder="Enter text"
                onChange={this.handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                type="text"
                value={this.state.formData.description}
                name="description"
                placeholder="A short description..."
                onChange={this.handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Ingredients</ControlLabel>
              <FormControl
                type="text"
                componentClass="textarea"
                value={this.state.formData.ingredients}
                name="ingredients"
                placeholder="Enter each ingredient on a new line."
                onChange={this.handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Instructions</ControlLabel>
              <FormControl
                componentClass="textarea"
                value={this.state.formData.method}
                name="method"
                placeholder="Enter each step on a new line."
                onChange={this.handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Preparation Time</ControlLabel>
              <FormControl
                type="text"
                value={this.state.formData.preptime}
                name="preptime"
                placeholder="time to prepare dish (in minutes)"
                onChange={this.handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Cooking Time</ControlLabel>
              <FormControl
                type="text"
                value={this.state.formData.cooktime}
                name="cooktime"
                placeholder="time to cook dish (in minutes)"
                onChange={this.handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Serves</ControlLabel>
              <FormControl
                type="text"
                value={this.state.formData.serves}
                name="serves"
                placeholder="Number of people this dish serves"
                onChange={this.handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Notes</ControlLabel>
              <FormControl
                type="text"
                value={this.state.formData.notes}
                name="notes"
                placeholder="Any notes you would like to add to appear after the recipe instructions, e.g. substitutions, advice"
                onChange={this.handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Tags</ControlLabel>
              <FormControl
                type="text"
                value={this.state.formData.tags}
                name="tags"
                placeholder="Tags separated by commas to help you find this recipe later, e.g. spicy, eggs, breakfast"
                onChange={this.handleFormChange}
              />
            </FormGroup>
            <ImageDropzone
              handleImageUpload={p => {this.setState({promise: p})}}
              setFilename={image  => { this.setState(prev => (
                {formData: {...prev.formData, image: image}}))}}
            />
            <Button	type="submit">Submit</Button>
          </form>
          }
        </div>
        <div id="my-recipes">
          <RecipesList
            recipes={this.state.recipes}
            isAuthenticated={this.props.isAuthenticated}
          />
        </div>
      </div>
    )
  }
}

export default Recipes
