import React from 'react'
import { Grid, Row } from 'react-bootstrap'
import MiniCard, { AddRecipeCard } from './MiniCard'
// import DebugRecipeCards from './DebugRecipeCards'

const RecipesList = (props)  => {

  return (
    <div>
      <h1>My Recipes</h1>
      <Grid><Row className="show-grid">
          <AddRecipeCard getRecipes={props.getRecipes}/>
          { props.recipes.reverse().map((recipe, index)  => {
            return <MiniCard key={index} recipe={recipe}
            updateRecipes={props.updateRecipes} /> }) }
      </Row></Grid>
      {/* <DebugRecipeCards recipes={props.recipes}/> */}
    </div>
  )
}
export default RecipesList
