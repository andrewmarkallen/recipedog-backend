import React, { useState } from 'react'
import {Button, Col, Jumbotron, Image, Grid, Row } from 'react-bootstrap'
import { users_service_url } from './Util'
import ContentEditable from 'react-contenteditable'
import axios from 'axios'

// import styled from 'styled-components'

var modifiedProperties = {}


// Handles all property editing
const handleContentEditable = (event) => {

  var id = event.currentTarget.id
  var value = event.target.value

  modifiedProperties[id] = value
  // console.log(modifiedProperties)
}

const RecipeCard = (props)  => {

  console.log(props.location.state)
  const {tags, recipe} = props.location.state
  const [editMode, setEditMode] = useState(false)


  function processModifiedValues() {
      const url = `${users_service_url}/recipes/${recipe.id}`
      axios.put(url, modifiedProperties).then((res)  => { console.log('todo') })
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
        onClick={handleClick}
        className="pull-right">Edit Recipe
        <span className={glyph} aria-hidden="true"></span>
      </Button>
    )
  }

  const DoneEditingButton = (props)  => {

    const handleClick = ()  => {
      setEditMode(false)
      processModifiedValues()
    }

    var glyph = "glyphicon glyphicon-check"
    return(
        <Button
          onClick={handleClick}
        >
          Done Editing
          <span className={glyph} aria-hidden="true"></span>
        </Button>
    )
  }

  const RecipeTitle = (props)  => {

    return(

      <Jumbotron>
        {props.tags && props.tags.map((tag) => {return <Tag tag={tag}/>})}
        <Favourite favourite={props.favourite}/>

        <h1 className="text-center">
        { editMode &&
            <ContentEditable
              html={props.title}
              className="content-editable"
              onChange={handleContentEditable}
            />
        }
        { !editMode && <div id="title">{props.title}</div> }
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
    console.log(props)
    var glyph = "glyphicon glyphicon-star-empty"
    if(props.favourite) { glyph = "glyphicon glyphicon-star" }
    return(
      <Button className="pull-left">
        <span className={glyph} aria-hidden="true"></span>
      </Button>
    )
  }

  const RecipeImage = (props)  => {
    const url = `${users_service_url}/images/${props.image}`
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
            { props.preptime && <h5 id="preptime"> Prep: {props.preptime} min </h5> }
            { props.cooktime && <h5 id="cooktime"> Cook: {props.cooktime} min </h5> }
          </Row>
        </Col>
        <Col xs={6}>
          <Row>
            { props.serves && <h5 className="pull-right">Serves {props.serves}</h5> }
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
        <p>{props.ingredients}</p>
      </div>
    )
  }

  const RecipeInstructions = (props)  => {
    return(
      <div className="instructions">
        <h3 className="text-center">Instructions</h3>
        <p>{props.method}</p>
        {props.notes &&
        <p>Notes: {props.notes}</p>
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
  </div>
  )
}

export default RecipeCard
