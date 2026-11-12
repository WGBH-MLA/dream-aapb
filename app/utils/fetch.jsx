export async function getExhibits(options = "") {
  return await safeGetWagData(process.env.AAPB_API_URL, `/exhibits/?${options}`)
}

export async function getCollections(options = "") {
  return await safeGetWagData(process.env.AAPB_API_URL, `/collections/?${options}`)
}

export async function getFeatured() {
  return await safeGetWagData(process.env.AAPB_API_URL, `/collections/?limit=3&order=random`)
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

async function safeGetWagData(host, path){
  let resp
  try {
    resp = await fetch(host + path)
  } catch(err){
    console.log( `Problem fetching ${path}!!`, err )
  }

  let datums = []
  if(resp){
    let body = await resp.json()
    if(body && body.items){
      datums = body.items
    }
  }
  
  return datums
}