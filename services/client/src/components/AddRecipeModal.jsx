import React from 'react'
import { Col, Button, ToggleButtonGroup,  Modal, ControlLabel, Form, FormControl, FormGroup, ToggleButton } from 'react-bootstrap'
import ImageDropzone from './ImageDropzone'
import axios from 'axios'
import { post_recipe } from './Util.jsx'


class AddRecipeModal extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.addRecipeSelector = this.addRecipeSelector.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)

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
      formType: 'manual',
      promise: Promise.resolve(),
      // Handle display of modal
      clicks: 0,
      show: false
    };
  }

  addRecipeSelector(eventKey) {
    this.setState({ formType: eventKey })
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
      formType: 'manual'
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
      // if we're uploading a file we need to wait for the promise for the image to be uploaded to resolve,
      // and if we're not uploading an image, promise will already be set as resolved
    await this.state.promise
    axios(post_recipe(this.state.formData)).then(()  => {
      this.props.getRecipes()
      this.handleClose()
    })
  }

  handleClose() {
     this.setState({ show: false })
     this.clearForm()
   }
  handleShow() { this.setState({ show: true }) }

  componentDidUpdate() {
    if (this.props.clicks > this.state.clicks)
      this.setState({ show: true, clicks: this.props.clicks })
  }

  render() {
    return (
      <div>
        <Modal id="add-recipe-modal" show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h1>Create something wonderful...</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="add-recipe-toggle">
                <ToggleButtonGroup type="radio" name="options" defaultValue={"manual"} onChange={this.addRecipeSelector}>
                  <ToggleButton value={"manual"}>Manually</ToggleButton>
                  <ToggleButton value={"fromURL"}>From a URL</ToggleButton>
                </ToggleButtonGroup>
              </div>
              <div className="form-group">
                {this.state.formType === 'fromURL' &&
                <div>coming soon</div>
                }
                {this.state.formType === 'manual' &&
                <div>
                <Form>
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
                  </Form>
                  <Form horizontal>
                  <FormGroup>
                    <Col sm={4}><ControlLabel>Preparation Time:
                    </ControlLabel></Col>
                    <Col sm={8}><FormControl
                      type="text"
                      value={this.state.formData.preptime}
                      name="preptime"
                      placeholder="time to prepare dish (in minutes)"
                      onChange={this.handleFormChange}
                    /></Col>
                  </FormGroup>
                  <FormGroup>
                    <Col sm={4}><ControlLabel>Cooking Time:
                    </ControlLabel></Col>
                    <Col sm={8}><FormControl
                      type="text"
                      value={this.state.formData.cooktime}
                      name="cooktime"
                      placeholder="time to cook dish (in minutes)"
                      onChange={this.handleFormChange}
                    /></Col>
                  </FormGroup>
                  <FormGroup>
                    <Col sm={4}><ControlLabel>Serves:</ControlLabel></Col>
                    <Col sm={8}><FormControl
                      type="text"
                      value={this.state.formData.serves}
                      name="serves"
                      placeholder="Number of people this dish serves"
                      onChange={this.handleFormChange}
                    /></Col>
                  </FormGroup>
                  <FormGroup>
                    <Col sm={4}><ControlLabel>Tags:</ControlLabel></Col>
                    <Col sm={8}><FormControl
                      type="text"
                      value={this.state.formData.tags}
                      name="tags"
                      placeholder="separated by commas, e.g. spicy, eggs"
                      onChange={this.handleFormChange}
                    /></Col>
                  </FormGroup>
                  </Form>
                  <Form>
                  <FormGroup>
                    <ControlLabel>Notes</ControlLabel>
                    <FormControl
                      type="text"
                      value={this.state.formData.notes}
                      name="notes"
                      placeholder="Any notes you would like to add to appear after the recipe, e.g. substitutions, advice"
                      onChange={this.handleFormChange}
                    />
                  </FormGroup>
                </Form>


                  <div id="droppy">
                  <ImageDropzone
                    handleImageUpload={p => {this.setState({promise: p})}}
                    setFilename={image  => { this.setState(prev => (
                      {formData: {...prev.formData, image: image}}))}}
                  />
                </div>

                </div>
                }
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button	type="submit" className="pullRight" id="add-recipe-submit" onClick={this.handleFormSubmit}>Submit</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AddRecipeModal
