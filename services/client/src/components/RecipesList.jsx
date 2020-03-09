import React from 'react'
import { Table } from 'react-bootstrap'

const images_path = `${process.env.REACT_APP_USERS_SERVICE_URL}/images/`

const RecipesList = (props)  => {

  function formatImage(image_url) {
    if(image_url) {
      const url = images_path + image_url
      return (
        <img src={url} width="100"></img>
      )
    }
    else return(<span>no image</span>)
  }
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
                  <td>
                    {formatImage(recipe.image)}
                  </td>
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
