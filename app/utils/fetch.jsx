import { redirect } from 'react-router';

export async function getExhibits() {
  let wagHost = process.env.WAGTAIL_HOST || "https://ov-wag-pr-258.dev.wgbh-mla.org:8000"
  let resp = await fetch(
    wagHost + '/api/v2/pages/?type=aapb_exhibits.AAPBExhibit&limit=999999',
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
  let wagHost = process.env.WAGTAIL_HOST || "https://ov-wag-pr-258.dev.wgbh-mla.org:8000"
  let resp =  await fetch(
    wagHost + `/api/v2/pages/?type=aapb_collections.AAPBCollection&limit=999999`,
    {
      headers: {Host: "aapb-api"},
    },
  )
  let body = await resp.json()
  return body.items

  // return collections.items
}

export async function getFeatured() {
  let wagHost = process.env.WAGTAIL_HOST || "https://ov-wag-pr-258.dev.wgbh-mla.org:8000"
  let resp =  await fetch(

    // wagHost + `/api/v2/pages/?type=aapb_collections.AAPBCollection?featured=true&limit=3`,
    wagHost + `/api/v2/pages/?type=aapb_collections.AAPBCollection&limit=3`,
    {
      headers: {Host: "aapb-api"},
    },
  )
  let body = await resp.json()
  return body.items

  // return collections.items
}

export async function getPageBySlug(type, slug) {
  let wagHost = process.env.WAGTAIL_HOST || "https://ov-wag-pr-258.dev.wgbh-mla.org:8000"
  var resp = await fetch(`${wagHost}/api/v2/pages?type=${type}&slug=${slug}`, {headers: {"Host": "aapb-api"}} )
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

  let wagHost = process.env.WAGTAIL_HOST || "https://ov-wag-pr-258.dev.wgbh-mla.org:8000"
  var fetchResp = await fetch(`${wagHost}/api/v2/pages/${body.items[0].id}`)
  return await fetchResp.json()
}
