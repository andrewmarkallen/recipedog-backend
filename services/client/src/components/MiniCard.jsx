import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonToolbar, Col, Modal } from 'react-bootstrap'
import { get_image_url_with_fallback, delete_recipe } from './Util'
import AddRecipeModal from './AddRecipeModal'
import axios from 'axios'

export const AddRecipeCard = (props)  => {

  const [clicks, setClicks] = useState(0)

  const clickHandler = ()  => {
    setClicks(clicks + 1)
  }

  return(
    <div>
      <AddRecipeModal clicks={clicks} getRecipes={props.getRecipes}/>
      <Col xs={12} sm={4} md={3} lg={3}>
        <div className="minicard addnew" onClick={clickHandler}>
          <img alt="example of a recipe" className="minicard-thumbnail"
            src={get_image_url_with_fallback("cupcake.jpg")}/>
          <div className="minicard-title">Click to add a new recipe!</div>
        </div>
      </Col>
    </div>
  )
}

const DeleteButton = (props)  => {

  const deleteRecipe = ()  => {
    axios(delete_recipe(props.id))
    .then(() => props.updateRecipes())
    .catch((err) =>console.log(err))
    setDeleteModal(false)
  }

  const [deleteModal, setDeleteModal] = useState(false)

  return(
    <div>
      { !deleteModal &&
        <span id="minicard-delete"
        className="glyphicon glyphicon-remove"
        onClick={() => setDeleteModal(true)}>
        </span>
      }
      <Modal id="delete-modal" show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <span id="modal-delete">Delete this recipe?</span>
          </Modal.Title>
          <Modal.Body>
            <h2 id="delete-modal-title">{props.title}</h2>
            <ButtonToolbar>
              <Button id="del-buttons-primary" block
                onClick={deleteRecipe}>Delete</Button>
              <Button id="del-buttons" bsSize="large" block
                onClick={() => setDeleteModal(false)}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Body>
        </Modal.Header>
      </Modal>

    </div>
  )

}

const MiniCard = (props)  => {

  const [showDelete, setShowDelete] = useState(false)

  return(
    <Col xs={12} sm={4} md={3} lg={3}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      { showDelete &&
        <DeleteButton title={props.recipe.title}
                      id={props.recipe.id}
                      updateRecipes={props.updateRecipes}/>
      }
      <Link to={
        {
          pathname: `recipe/${props.recipe.id}`,
          state: { recipe: props.recipe }
        }
      }>
        <div className="minicard">
          <img src={get_image_url_with_fallback(props.recipe.image)}
            className="minicard-thumbnail"
            alt={props.recipe.title}
            modid={props.recipe.id? props.recipe.id % 12 : 0 }
          />
          <div className="minicard-title">{props.recipe.title}</div>
        </div>
      </Link>
    </Col>
  )
}

export default MiniCard;
