import React, { Component, useMemo, useState, useEffect } from 'react'
import { Button, ControlLabel, DropdownButton, FormControl, FormGroup, MenuItem } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { Link } from 'react-router-dom'
import RecipesList from './RecipesList'

const upload_url = `${process.env.REACT_APP_USERS_SERVICE_URL}/upload`

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
}

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
}

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};



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
      uploading: false
    }



    this.addRecipeSelector = this.addRecipeSelector.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
    this.getUploadParams = this.getUploadParams.bind(this)
    this.setState = this.setState.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.BasicDropzone = this.BasicDropzone.bind(this)
    this.Spinner = this.Spinner.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount')
    if (this.props.isAuthenticated)
      {this.getRecipes()}
  }

  getRecipes() {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/recipes`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.authToken}`
      }
    }
    console.log('GET RECIPES CALLED')
    console.log(options)
    return axios(options)
    .then((res)  => {
      console.log(res)
      this.setState({
        recipes: res.data.data

      })
    })
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

  getUploadParams = ({meta})  =>  {
    return  {
            url: `${process.env.REACT_APP_USERS_SERVICE_URL}/upload`    }
  }

  handleFormChange(event) {
    console.log('handleFormChange')
    console.log(event.target.name)
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
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/recipes`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.authToken}`,
      },
      data: this.state.formData

    }
    axios(options).then(()  => {this.getRecipes()})
    console.log(options)
  }

  Spinner(props) {
    if(this.state.uploading) {
      console.log("uploading")
      return (
        <div>UPLOADING</div>
      )
    }
    else {
      return (
      <div>NOT UPLOADING</div>
    )}
  }

  BasicDropzone(props) {
    const [files, setFiles] = useState([])
    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject
    } = useDropzone({
      accept: 'image/*',
      onDrop: acceptedFiles  => {
        setFiles(acceptedFiles.map(file  => Object.assign(file, {
          preview: URL.createObjectURL(file)

        })))
        acceptedFiles.map(file  => {
          console.log(file)
          var formData = new FormData()
          formData.append('file', file)
          this.setState({uploading: true})
          const promise = axios.post(upload_url, formData)
            .then((res)  => {
              console.log('POSTed')
              console.log(res.data.filename)
              const obj = this.state.formData
              obj['image'] = res.data.filename
              this.setState(obj)
            })
            .catch((err)  => {console.log(err.response)})
          const obj = {promise: promise, uploading: false}
          this.setState(obj)
          return promise
        })

      }
    })

    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
          <div style={thumbInner}>
            <img
              alt='prepared_recipe'
              src={file.preview}
              style={img}
            />
          </div>
        </div>
      ))

    useEffect(()  => ()  => {
      files.forEach(file  => URL.revokeObjectURL(file.preview))
    }, [files])

    const style = useMemo(()  => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }), [
      isDragActive,
      isDragAccept,
      isDragReject
    ])


    return (
        <div className="container">
          <div {...getRootProps({style})}>
            <input {...getInputProps()} />
            <p>Drag and drop some files</p>
          </div>
          <aside style={thumbsContainer}>
            {thumbs}
          </aside>
        </div>
    )

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
            <this.BasicDropzone/>
            <Button	type="submit">Submit</Button>
          </form>
          }
        </div>
        <div id="spinner">
          <this.Spinner/>
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