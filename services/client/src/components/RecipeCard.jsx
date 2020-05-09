import React, { useState, useEffect } from 'react'
import {Button, Col, Jumbotron, Image, Grid, Glyphicon, Row } from 'react-bootstrap'
import {  delete_tag, add_tag, put_recipe,
          get_image_url_with_fallback, get_tags } from './Util'
import ChangesSavedModal from './ChangesSavedModal'
import ContentEditable from 'react-contenteditable'
import axios from 'axios'
import ImageDropzone from './ImageDropzone'
import Chips from 'react-chips'

import sanitizeHtml from 'sanitize-html-react'

var modifiedProperties = {}

const removeTags = (html)  => {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: []
  })
}

// Handles all property editing
const handleEdit = (event) => {

  // The element is suffixed with '-editable' which we strip off
  var id = event.currentTarget.id.split("-")[0]
  console.log(event.target.value)
  console.log(removeTags(event.target.value))
  modifiedProperties[id] = removeTags(event.target.value)
}

const load_tags = (id, setTags)  => {
  if(id)
    axios(get_tags(id)).then((res)  => { setTags(res.data.data) })
}



const RecipeCard = (props)  => {

    const [recipe, setRecipe] = useState(props.location.state.recipe)
    const [tags, setTags] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [editsSaved, setEditsSaved] = useState(false)

    useEffect(()  => {load_tags(recipe.id, setTags)}, [recipe])

  function processModifiedValues(properties) {
      axios(put_recipe(recipe.id, properties)).then((res)  => {
        // Don't show modal if we set favourite
        const keys = Object.keys(properties)
        if(!keys === ['favourite']) { setEditsSaved(true) }
        // Combine new properties with existing recipe
        const combined = {...recipe, ...properties}
        setRecipe(combined)
       })
      .catch((err)  => { console.log(err)})
  }

  function processTags(newTags) {
    // Make changes to UI first
    setTags(newTags)
    // Then make changes to back end
    const insertions = newTags.filter(el  => !tags.includes(el))
    const deletions = tags.filter(el  => !newTags.includes(el))

    insertions.map((tag)  => axios(add_tag(recipe.id, tag)))
    deletions.map((tag)  => axios(delete_tag(recipe.id, tag)))
  }

  const EditButton = (props)  => {
    return(
      <div>
      { !editMode &&
        <Button id="edit-button" onClick={()=>setEditMode(true)}
        className="pull-right editingButton">
        <span className="glyphicon glyphicon-pencil" aria-hidden="true">
        </span></Button>
      }
      </div>
    )
  }

  const DoneEditingButton = (props)  => {

    const handleClick = ()  => {
      setEditMode(false)
      processModifiedValues(modifiedProperties)
      modifiedProperties = {}
    }

    return(
      <div>
        { editMode &&
        <Button onClick={handleClick} id="done-editing" className="pull-right editingButton">
          <span className="glyphicon glyphicon-check pull-right" aria-hidden="true">
          </span></Button>
        }
      </div>
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
      <Jumbotron id="title-jumbotron">
        <Favourite favourite={props.favourite}/>
        <div className="tags">{ props.tags &&
          <Chips id="tagbox" value={props.tags} onChange={processTags}
            createChipKeys={[13,',']} placeholder="add some tasty tags"/>
        }</div>

        <h1 className="text-center">
          <EditableField editMode={editMode} id="title"
          html={props.title} onChange={handleEdit}/>
        </h1>
        <EditButton/>
      </Jumbotron>
    )
  }

  const Favourite = (props)  => {

    var starfill="nofill"
    if(props.favourite) { starfill = "starfill" }

    const handleClick = () => {
      processModifiedValues({'favourite': !props.favourite})
    }

    return(
      <Button id="favourite" className={`pull-left ${starfill}`} onClick={handleClick}>
        <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
      </Button>
    )
  }

  const RecipeImage = (props)  => {

    const [imageEditMode, setImageEditMode] = useState(false)
    const [ready, setReady] = useState(false)
    const [newImage, setNewImage] = useState(null)

    const handleClick = ()  => {
      setImageEditMode(true)
    }

    return(
      <div>
        { !imageEditMode &&
          <div>
            <Image src={get_image_url_with_fallback(props.image)}
              modid={props.id % 12 }
              id="recipecard-image"
              responsive />
            <Button id="edit-image" onClick={handleClick}>
              <Glyphicon glyph="pencil"></Glyphicon>
            </Button>
          </div>
        }
        { imageEditMode &&
          <div id="droppy-recipecard">
            <ImageDropzone id="recipecard-image-dropzone"
            handleImageUpload={()  => {setReady(true)}}
            setFilename={newImage  => setNewImage(newImage)}
            />
            <Button id="edit-image" onClick={() => {
              if(ready)
              {
                processModifiedValues({image: newImage})
                setReady(false)
                setImageEditMode(false)
              }
            }}>
            <Glyphicon glyph="check"></Glyphicon>
            </Button>
          </div>
        }
      </div>
    )
  }

  const RecipeDescription = (props)  => {

    const formatDate = (date)  => {
      return date.slice(0, 16)
    }

    return(
      <div className="description">
        <Col xs={5}>
          <Row id="rowboy">
            { (editMode || props.preptime || props.cooktime ) &&
            <div><span id="clock" className="glyphicon glyphicon-time" aria-hidden="true"></span></div>
            }
            { (editMode || props.preptime) &&
              <h5 id="preptime-field">
                Prep:{' '}
                <EditableField
                  editMode={editMode} id="preptime"
                  html={props.preptime ? props.preptime.toString() : ''}
                  onChange={handleEdit}/>
                {' '}min </h5>
            }
            { (editMode || props.cooktime) &&
              <h5 id="cooktime-field">
                Cook:{' '}
                <EditableField
                  editMode={editMode} id="cooktime"
                  html={props.cooktime ? props.cooktime.toString() : ''}
                  onChange={handleEdit}/>
                {' '}min </h5>
            }
          </Row>
        </Col>
        <Col xs={5}>
          <Row>
            { (editMode || props.serves) &&
              <div id="serves-block">
              <span id="cutlery" className="glyphicon glyphicon-cutlery" aria-hidden="true"></span>
              <h5 className="pull-right text-right" id="serves">Serves{' '}
                <EditableField
                  editMode={editMode} id="serves"
                  html={props.serves ? props.serves.toString() : ''} onChange={handleEdit}/>
              </h5>
            </div>
            }
          </Row>
        </Col>
        <Col xs={12}>
          <div><h4 className="text-center">
            <EditableField
              editMode={editMode} id="description"
              html={props.description} onChange={handleEdit}/>
          </h4></div>
        </Col>
        <Col xs={12}>
          <div><h4 id="date" className="text-center">{formatDate(props.date)}</h4></div>
        </Col>
      </div>
    )
  }

  const RecipeIngredients = (props)  => {
    return(
      <div className="ingredients">
        <h3 className="text-left" id="ingredients-heading">Ingredients</h3>
          <EditableField
            editMode={editMode} id="ingredients"
            html={props.ingredients.toString()} onChange={handleEdit}/>
      </div>
    )
  }

  const RecipeInstructions = (props)  => {
    return(
      <div className="instructions">
        <h3 className="text-left" id="instructions-heading">Instructions</h3>
        <div>
          <EditableField
            editMode={editMode} id="method"
            html={props.method} onChange={handleEdit}/>
        </div>
        { (editMode || props.notes) &&
        <div id="notes-heading">Notes:{' '}
          <EditableField
            editMode={editMode} id="notes"
            html={props.notes} onChange={handleEdit}/>
        </div>
        }
      </div>
    )
  }

  return(
    <div >

      <div className="recipe">
        <Grid>
          <Col xs={12} md={8} mdOffset={2} lg={10} lgOffset={1} className="recipecard">
            <Row>

              <Col xs={12} lg={6}>
                <RecipeTitle
                  tags={tags}
                  title={recipe.title}
                  favourite={recipe.favourite}
                />
                <RecipeImage image={recipe.image} id={recipe.id}/>
                <RecipeDescription
                  preptime={recipe.preptime}
                  cooktime={recipe.cooktime}
                  serves={recipe.serves}
                  description={recipe.description}
                  date={recipe.date}
                />
              </Col>

              <Col xs={12} lg={6}>
                <RecipeIngredients ingredients={recipe.ingredients}/>
                <RecipeInstructions method={recipe.method} notes={recipe.notes}/>
                <DoneEditingButton/>
              </Col>
            </Row>
          </Col>
        </Grid>
      </div>

      <ChangesSavedModal show={editsSaved} />
  </div>
  )
}

export default RecipeCard
