import React from 'react'
import { Grid, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import MiniCard from './MiniCard'
import { example_recipe } from './Util'

const Examples = (props) => (
  <div>
    <h1>Your recipes are all easily visible</h1>
    <div id="examples-cards" style={{visibility:"visible"}}>
      <Grid><Row className="show-grid">
          { [example_recipe,example_recipe,example_recipe].map((recipe, index)  => {
            return <MiniCard key={index} recipe={recipe}
            updateRecipes={()=>{}} /> }) }
      </Row></Grid>

      <div className="text-body">Click on a recipe card to view a recipe. These example recipes are visible to everyone, but only you can see your own recipes (unless you choose to share them with someone else).</div>
         <br/>
      <h1>Easy to get started</h1>
      <div className="text-body">Just click on <Link to="/register">register</Link> to sign up and start adding recipes of your own.</div>
    </div>

    <div className="text-body" id="examples-recipe" style={{visibility:"hidden"}}>
      <div>this should be invisble initially</div>
    </div>
  </div>
)

export default Examples
