export const users_service_url = `${process.env.REACT_APP_USERS_SERVICE_URL}`
export const upload_url = `${process.env.REACT_APP_USERS_SERVICE_URL}/upload`
export const recipes_url = `${process.env.REACT_APP_USERS_SERVICE_URL}/recipes`

export const delete_tag = (recipe_id, tag)  =>  {
  return {
    url: `${users_service_url}/recipes/${recipe_id}/tag`,
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.localStorage.authToken}`
    },
    data: {tag}
  }
}

export const add_tag = (recipe_id, tag)  =>  {
  return {
    url: `${users_service_url}/recipes/${recipe_id}/tag`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.localStorage.authToken}`
    },
    data: {tag}
  }
}
