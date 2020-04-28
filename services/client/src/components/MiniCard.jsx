import React, {useState } from 'react'
import { Link } from 'react-router-dom'
import { Col } from 'react-bootstrap'
import { get_image_url_with_fallback, get_recipe_url } from './Util'
import AddRecipeModal from './AddRecipeModal'

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

const MiniCard = (props)  => {

  return(
    <Col xs={12} sm={4} md={3} lg={3}>
      <Link to={{
        pathname: get_recipe_url(props.recipe.id),
        state: {
          recipe: props.recipe
        }
      }}>
        <div className="minicard">
          <img className="minicard-thumbnail"
            alt={props.recipe.title}
            modid={props.recipe.id % 12 }
            src={get_image_url_with_fallback(props.recipe.image)}/>
          <div className="minicard-title">{props.recipe.title}</div>
        </div>
      </Link>
    </Col>
  )
}

export default MiniCard;
