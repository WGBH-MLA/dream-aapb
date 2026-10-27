export async function getExhibits(options = "") {
  let wagHost = process.env.AAPB_API_URL
  let resp

  try {
    resp = await fetch(
      wagHost + `/exhibits/?` + options,
    ).catch((error) => {
      console.log("Error fetching exhibits", error)
    })

  } catch(error){
    console.log( 'Problem fetching exhibits!!', err )
  }

  let exhibits = []
  if(resp){
    let body = await resp.json()
    exhibits = body.items
  }

  return exhibits
}

export async function getCollections(options = "") {
  let wagHost = process.env.AAPB_API_URL
  let resp
  try {
    resp = await fetch(`${wagHost}/collections/?${options}`).catch((err) => {
      console.log( 'Error fetching collections!', err )
    })
  } catch(err) {
    console.log( 'Problem fetching collections!!', err )
  }
  
  let collections = []
  if(resp){
    let body = await resp.json()
    collections = body.items
  }

  return collections
}

export async function getFeatured() {
  let wagHost = process.env.AAPB_API_URL
  let resp
  try {
    resp = await fetch(wagHost + `/collections/?limit=3&order=random`)
  } catch(err){
    console.log( 'Problem fetching featured!!', err )
  }

  let featured = []
  if(resp){
    let body = await resp.json()
    featured = body.items  
  }
  
  return featured
}

export async function getPageBySlug(type, slug) {
  let wagHost = process.env.AAPB_API_URL
  var resp = await fetch(`${wagHost}/pages/?type=${type}&slug=${slug}`)
  var body
  try {
    body = await resp.json()
  } catch (error) {
    console.log('Invalid JSON...', body, error)
  }

  if (!body || body?.meta?.total_count === 0) {
    console.log(`Page not found by slug`)
    throw new Response('Page not found', {
      status: 404,
      statusText: `Not found: ${slug}`,
    })
  }

  var fetchResp = await fetch(`${wagHost}/pages/${body.items[0].id}`)
  return await fetchResp.json()
}

export async function getLatestBlogPosts() {
  const response = await fetch('https://blog.americanarchive.org/wp-json/wp/v2/posts?per_page=4&page=1&orderby=date&order=desc')
  if(response){
    return await response.json()
  }
}
