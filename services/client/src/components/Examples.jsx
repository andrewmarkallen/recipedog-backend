import React from 'react'
import { Link } from 'react-router-dom'

const Examples = (props) => (
  <div>
    <div id="examples-cards" style={{visibility:"visible"}}>
      <div>todo: a bunch of cards</div>
      <div className="text-body">Click on a recipe card to view a recipe. These example recipes are visible to everyone, but only you can see your own recipes (unless you choose to share them with someone else).</div>
         <br/>

      <div className="text-body">Click on <Link to="/register">register</Link> to sign up and start adding recipes of your own.</div>
    </div>

    <div className="text-body" id="examples-recipe" style={{visibility:"hidden"}}>
      <div>this should be invisble initially</div>
    </div>
  </div>
)

export default Examples
