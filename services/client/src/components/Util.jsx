export const users_service_url = `${process.env.REACT_APP_USERS_SERVICE_URL}`
export const upload_url = `${process.env.REACT_APP_USERS_SERVICE_URL}/upload`
export const recipes_url = `${process.env.REACT_APP_USERS_SERVICE_URL}/recipes`
export const recipe_url = `${process.env.REACT_APP_USERS_SERVICE_URL}/recipe`
export const tag_url = (id)  => `${users_service_url}/recipes/${id}/tag`
export const get_tag_url = (id)  => `${users_service_url}/recipes/${id}/tags`
export const get_image_url = (id)  => `${users_service_url}/images/${id}`
export const get_recipe_url = (id)  => `${recipe_url}/${id}`
export const get_recipes_url = (id)  => `${recipes_url}/${id}`
export const auth_json = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${window.localStorage.authToken}`
}

export const get_image_url_with_fallback = (filename)  => {
  if (!filename)
  {
    return get_image_url("none2.png")
  }
  return get_image_url(filename)
}

export const axios_options = (url, method, headers, data=undefined)  => {
  const options = {
    url: url,
    method: method,
    headers: headers,
  }
  if (data !== undefined) { options.data = data}
  return options
}
export const post_recipe = (form_data)  => {
  return axios_options(recipes_url, 'post', auth_json, form_data)
}

export const delete_recipe = (recipe_id)  => {
  return axios_options(get_recipe_url(recipe_id), 'delete', auth_json)
}

export const get_recipes = ()  => {
  return axios_options(recipes_url, 'get', auth_json)
}

export const delete_tag = (recipe_id, tag)  =>  {
  return axios_options(tag_url(recipe_id), 'delete', auth_json, {tag})
}

export const add_tag = (recipe_id, tag)  =>  {
  return axios_options(tag_url(recipe_id), 'post', auth_json, {tag})
}

export const get_tags = (recipe_id)  => {
  return axios_options(get_tag_url(recipe_id), 'get', auth_json)
}

export const put_recipe = (recipe_id, data)  => {
  return axios_options(get_recipes_url(recipe_id), 'put', auth_json, data)
}
