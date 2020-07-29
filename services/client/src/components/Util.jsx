export const users_service_url = `${process.env.REACT_APP_USERS_SERVICE_URL}`
export const upload_url = `${process.env.REACT_APP_USERS_SERVICE_URL}/upload`
export const recipes_url = `${process.env.REACT_APP_USERS_SERVICE_URL}/recipes`
export const recipe_url = `${process.env.REACT_APP_USERS_SERVICE_URL}/recipe`
export const search_url = `${process.env.REACT_APP_USERS_SERVICE_URL}/search`
export const tag_url = (id)  => `${users_service_url}/recipes/${id}/tag`
export const get_tag_url = (id)  => `${users_service_url}/recipes/${id}/tags`
export const get_image_url = (id)  => `${users_service_url}/images/${id}`
export const get_recipe_url = (id)  => `${recipe_url}/${id}`
export const get_recipes_url = (id)  => `${recipes_url}/${id}`
export const search_recipes_url = `${search_url}`

export const auth_json = () => {
  const a_j = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${window.localStorage.authToken}`
  }
  return a_j
}

export const get_image_url_with_fallback = (filename)  => {
  if (!filename)
  {
    return get_image_url("none2.png")
  }
  return get_image_url(filename)
}

export const axios_options = (url, method, headers,
                              data=undefined, queryString='')  => {
  const options = {
    url: url,
    method: method,
    headers: headers,
  }
  if (data !== undefined) { options.data = data}
  if (queryString) {
    options.url = `${url}${queryString}`
    console.log(options)
  }
  return options
}

export const post_recipe = (form_data)  => {
  return axios_options(recipes_url, 'post', auth_json(), form_data)
}

export const delete_recipe = (recipe_id)  => {
  return axios_options(get_recipes_url(recipe_id), 'delete', auth_json())
}

export const get_recipe = (id) => {
  return axios_options(get_recipes_url(id), 'get', auth_json())
}

export const get_recipes = ()  => {
  return axios_options(recipes_url, 'get', auth_json())
}

export const delete_tag = (recipe_id, tag)  =>  {
  return axios_options(tag_url(recipe_id), 'delete', auth_json(), {tag})
}

export const add_tag = (recipe_id, tag)  =>  {
  return axios_options(tag_url(recipe_id), 'post', auth_json(), {tag})
}

export const get_tags = (recipe_id)  => {
  return axios_options(get_tag_url(recipe_id), 'get', auth_json())
}

export const put_recipe = (recipe_id, data)  => {
  return axios_options(get_recipes_url(recipe_id), 'put', auth_json(), data)
}

export const search_recipes = (query)  => {
  return axios_options(search_recipes_url, 'get', auth_json(), undefined, query)
}

// A valid example recipe to use anywhere
export const example_recipe = {
  'cooktime': 25,
  'date': "Sat, 14 Mar 2020 02:04:03 GMT",
  'description': "mushroom on toast",
  'favourite': true,
  'id': 10,
  'image': "56046a6319ae4e20bd67bfbf371a1783.jpg",
  'ingredients': "mushrooms,\ntoast,\npepper",
  'method': "toast bread\nfry mushrooms\ngrind pepper",
  'notes': "for experts only",
  'preptime': 45,
  'serves': 7,
  'title': "Mushroom Toast",
  'url': ""
}

export const copyright = '\u00a9'

export const recaptcha_site_key = `${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`.replace(/'/g, '')
