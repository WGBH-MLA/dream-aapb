import { redirect } from 'react-router';

export async function getExhibits() {
  let wagHost = process.env.AAPB_API_URL
  let resp = await fetch(
    wagHost + '/pages/?type=aapb_exhibits.AAPBExhibit&limit=999999',
    {
      headers: {"Host": "aapb-api"},
    },  
    res => {
      console.log('exs', res)
    }
  )

  let body = await resp.json()

  // TODO REMOVE ->> real top level exhibits via top_exhibit field
  // return body.items.filter((ex) => (ex.meta.html_url.match(/\//g) || []).length == 4 )
  return body.items
}

export async function getCollections() {
  let wagHost = process.env.AAPB_API_URL
  let resp =  await fetch(
    wagHost + `/pages/?type=aapb_collections.AAPBCollection&limit=999999`,
    {
      headers: {Host: "aapb-api"},
    },
  )
  let body = await resp.json()
  return body.items

  // return collections.items
}

export async function getFeatured() {
  let wagHost = process.env.AAPB_API_URL
  let resp =  await fetch(
    wagHost + `/pages/?type=aapb_collections.AAPBCollection&limit=3`,
    {
      headers: {Host: "aapb-api"},
    },
  )
  let body = await resp.json()
  return body.items

  // return collections.items
}

export async function getPageBySlug(type, slug) {
  let wagHost = process.env.AAPB_API_URL
  var resp = await fetch(`${wagHost}/pages?type=${type}&slug=${slug}`, {headers: {"Host": "aapb-api"}} )
  var body
  try {
    body = await resp.json()
  } catch(error){
    console.log( 'Invalid JSON...', body, error )
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
