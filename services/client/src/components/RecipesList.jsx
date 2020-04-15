import React, { useState,  useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { users_service_url} from './Util'
import { Link } from 'react-router-dom'
import axios from 'axios'

const RecipesList = (props)  => {

  const [tags, setTags] = useState({})
  useEffect(()  => { if(props.isAuthenticated) {getTags()}},
                   [props.recipes])

  function getTags() {
    console.log('getTags')
    props.recipes.map((recipe)  => {
      if (recipe.id === undefined) { return 'loading' }
      else
      {
        const options = {
          url: `${users_service_url}/recipes/${recipe.id}/tags`,
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.localStorage.authToken}`
          }
        }
        return axios(options)
        .then((res)  => {
          var newTags = Object.assign({}, tags)
          newTags[recipe.id] = res.data.data
          setTags(tags  => { return {...tags, ...newTags} })
          return res.data.data
        })
      }
    })
  }

  function imageTag(image_url, title) {
    if(image_url) {
      const url = users_service_url + '/images/' + image_url
      return (
        <img alt={title} src={url} width="100"></img>
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
            <th>Tags</th>
            <th>Cooktime</th>
            <th>Serves</th>
            <th>Notes</th>
            <th>Preptime</th>
          </tr>
        </thead>
        <tbody>
          {
            props.recipes.map((recipe, index)  => {
              return (
                <tr key={index} id={recipe.id}>
                  <td>
                      <Link to={
                        {
                          pathname: `/recipe/${recipe.id}`,
                          state: {
                            recipe: recipe,
                            tags: tags[recipe.id]
                          }
                        }
                      }>
                        {recipe.title}
                      </Link>
                  </td>
                  <td>{recipe.description}</td>
                  <td>{recipe.ingredients}</td>
                  <td>{recipe.method}</td>
                  <td>
                    {imageTag(recipe.image, recipe.title)}
                  </td>
                  <td>{recipe.url}</td>
                  <td><span id="tags">
                    {tags[recipe.id] && tags[recipe.id].join()}
                  </span></td>
                  <td>{recipe.preptime}</td>
                  <td>{recipe.cooktime}</td>
                  <td>{recipe.notes}</td>
                  <td>{recipe.serves}</td>
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
