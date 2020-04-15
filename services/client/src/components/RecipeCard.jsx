import React, { useState } from 'react'
import {Button, Col, Jumbotron, Image, Grid, Row } from 'react-bootstrap'
import { users_service_url } from './Util'
import ChangesSavedModal from './ChangesSavedModal'
import ContentEditable from 'react-contenteditable'
import axios from 'axios'

// import styled from 'styled-components'

var modifiedProperties = {}

// Handles all property editing
const handleEdit = (event) => {

  // The element is suffixed with '-editable' which we strip off
  var id = event.currentTarget.id.split("-")[0]
  var value = event.target.value

  modifiedProperties[id] = value
}


const RecipeCard = (props)  => {

  console.log(props.location.state)
  const [recipe, setRecipe] = useState(props.location.state.recipe)
  const [tags, setTags] = useState(props.location.state.tags)
  const [editMode, setEditMode] = useState(false)
  const [editsSaved, setEditsSaved] = useState(false)

  function processModifiedValues(properties) {
      const options = {
        url: `${users_service_url}/recipes/${recipe.id}`,
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${window.localStorage.authToken}`
        },
        data: properties
      }
      axios(options).then((res)  => {
        const keys = Object.keys(properties)
        // Don't show modal if we set favourite
        if(!(keys.length === 1 && keys[0] === 'favourite'))
        {
          setEditsSaved(true)
        }
        const combined = {...recipe, ...properties}
        setRecipe(combined)
       })
      .catch((err)  => { console.log(err)})

  }

  const EditButton = (props)  => {

    const handleClick = ()  => {
      setEditMode(true)
      console.log(editMode)
    }

    var glyph = "glyphicon glyphicon-pencil"
    return(
      <Button
        id="edit-button"
        onClick={handleClick}
        className="pull-right">Edit Recipe
        <span className={glyph} aria-hidden="true"></span>
      </Button>
    )
  }

  const DoneEditingButton = (props)  => {

    const handleClick = ()  => {
      setEditMode(false)
      processModifiedValues(modifiedProperties)
      modifiedProperties = {}
    }

    var glyph = "glyphicon glyphicon-check"
    return(
        <Button
          onClick={handleClick}
          id="done-editing"
        >
          Done Editing
          <span className={glyph} aria-hidden="true"></span>
        </Button>
    )
  }

  const EditableField = (props)  => {

    return(
      <span className="editableField">
      { props.editMode &&
        <ContentEditable
          id={props.id + "-editable"}
          html={props.html}
          className="content-editable"
          onChange={props.onChange}/>
      }
      { !editMode && <span id={props.id}>{props.html}</span> }
      </span>
    )
  }

  const RecipeTitle = (props)  => {

    return(

      <Jumbotron>
        {props.tags && props.tags.map((tag, index) => {
          return <Tag key={index} tag={tag}/>
        })}
        <Favourite favourite={props.favourite}/>
        <h1 className="text-center">
          <EditableField
            editMode={editMode} id="title"
            html={props.title} onChange={handleEdit}/>
        </h1>
        <EditButton/>
      </Jumbotron>
    )
  }

  const Tag = (props)  => {
    console.log(props)
    return(
      <div>{props.tag}</div>
    )
  }

  const Favourite = (props)  => {

    const handleClick = ()  => {
      processModifiedValues({'favourite': !props.favourite})
    }

    console.log(props)
    var glyph = "glyphicon glyphicon-star-empty"
    if(props.favourite) { glyph = "glyphicon glyphicon-star" }
    return(
      <Button className="pull-left"
              onClick={handleClick}>
        <span className={glyph} aria-hidden="true"></span>
      </Button>
    )
  }

  const RecipeImage = (props)  => {
    let image = props.image
    if(image === "")
    {
      image = "none.png"
    }
    const url = `${users_service_url}/images/${image}`
    return(
      <Image src={url} responsive />
    )
  }

  const RecipeDescription = (props)  => {
    console.log('date', props.date)
    return(
      <div className="description">
        <Col xs={6}>
          <Row>
            { props.preptime &&
              <h5 id="preptime-field">
                Preparation time:{' '}
                <EditableField
                  editMode={editMode} id="preptime"
                  html={props.preptime.toString()} onChange={handleEdit}/>
                min </h5>
            }
            { props.cooktime &&
              <h5 id="cooktime-field">
                Cooking time:{' '}
                <EditableField
                  editMode={editMode} id="cooktime"
                  html={props.cooktime.toString()} onChange={handleEdit}/>
                min </h5>
            }
          </Row>
        </Col>
        <Col xs={6}>
          <Row>
            { props.serves &&
              <h5 className="pull-right">Serves{' '}
                <EditableField
                  editMode={editMode} id="serves"
                  html={props.serves.toString()} onChange={handleEdit}/>
              </h5>
            }
          </Row>
        </Col>
        <Col xs={12}>
          <div><h4 className="text-center">{props.description}</h4></div>
        </Col>
        <Col xs={12}>
          <div><h4 className="text-center">{props.date}</h4></div>
        </Col>
      </div>
    )
  }

  const RecipeIngredients = (props)  => {
    return(
      <div className="ingredients">
        <h3 className="text-center">Ingredients</h3>
        {/* <p></p> */}
          <EditableField
            editMode={editMode} id="ingredients"
            html={props.ingredients.toString()} onChange={handleEdit}/>

      </div>
    )
  }

  const RecipeInstructions = (props)  => {
    return(
      <div className="instructions">
        <h3 className="text-center">Instructions</h3>
        <div>
          <EditableField
            editMode={editMode} id="method"
            html={props.method} onChange={handleEdit}/>
        </div>
        {props.notes &&
        <div>Notes:{' '}
          <EditableField
            editMode={editMode} id="notes"
            html={props.notes} onChange={handleEdit}/>
        </div>
        }
      </div>
    )
  }


  return(
    <div className="recipecard">
      <div className="recipe">
        <Grid>
          <Col xs={12} md={6} mdOffset={3}>
            <Row>
              <RecipeTitle
                id = "title"
                tags={tags}
                title={recipe.title}
                favourite={recipe.favourite}
              />
            </Row>
            <Row>
              <RecipeImage image={recipe.image}/>
            </Row>
            <Row>
              <RecipeDescription
                id="decription"
                preptime={recipe.preptime}
                cooktime={recipe.cooktime}
                serves={recipe.serves}
                description={recipe.description}
                date={recipe.date}
              />
            </Row>
            <Row>
              <RecipeIngredients ingredients={recipe.ingredients}/>
            </Row>
            <Row>
              <RecipeInstructions method={recipe.method} notes={recipe.notes}/>
            </Row>
          </Col>
        </Grid>
      </div>
      <div className="doneEditingButton">
      <DoneEditingButton />
      </div>
      <ChangesSavedModal show={editsSaved} />
  </div>
  )
}

export default RecipeCard
