import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { get_tags, get_image_url } from './Util'
import React, {useState, useEffect} from 'react'
import axios from 'axios'

const DebugRecipeCards = (props)  => {

  const [tags, setTags] = useState({})

  useEffect(()  => { getTags()}, [props.recipes])

  function getTags() {
    props.recipes.map((recipe)  => {
      if (recipe.id === undefined) { return 'loading' }
      else
      {
        return axios(get_tags(recipe.id))
        .then((res)  => {
          var newTags = Object.assign({}, tags)
          newTags[recipe.id] = res.data.data
          setTags(tags  => { return {...tags, ...newTags} })
          return res.data.data
        })
      }
    })
  }

  function imageTag(filename, title) {
      return (
        <div className="imageTag">
        { filename && <img alt={title} src={get_image_url(filename)} width="100"></img> }
        { !filename && <span>no image</span> }
      </div>
      )
  }

  return(
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
  )
}

export default DebugRecipeCards
