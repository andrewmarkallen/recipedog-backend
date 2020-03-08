import React from 'react'
import { Table } from 'react-bootstrap'

const RecipesList = (props)  => {
  return (
    <div>
      <h1>My Recipes</h1>
      <hr/><br/>
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Ingredients</th>
            <th>Instructions</th>
            <th>Image</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {
            props.recipes.map((recipe)  => {
              return (
                <tr key={recipe.id}>
                  <td>{recipe.title}</td>
                  <td>{recipe.description}</td>
                  <td>{recipe.ingredients}</td>
                  <td>{recipe.method}</td>
                  <td>{recipe.image}</td>
                  <td>{recipe.url}</td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    </div>
  )
}
export default RecipesList
