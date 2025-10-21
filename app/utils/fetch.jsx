import { redirect } from 'react-router';

export async function getExhibits() {
  return await fetch(
    process.env.WAGTAIL_HOST + '/api/v2/exhibits/?limit=999999',
    res => {
      console.log('exs', res)
    }
  )
}

export async function getCollections() {
  return await fetch(
    process.env.WAGTAIL_HOST + '/api/v2/collections/?limit=999999'
  )
}

export async function getPageBySlug(type, slug) {
  const body = await fetch(
    `${process.env.WAGTAIL_HOST}/api/v2/pages/?slug=${slug}`
  )
    .then(res => res.json())
    .catch(err => {
      console.log('fetch error', err)
      throw new Response(`Error fetching ${type}`, {
        status: 500,
        statusText: 'Something went wrong. Try again later.',
      })
    })
  if (body.meta?.total_count === 0) {

    console.log(`Page not found by slug`)

    // 
    // Maybe it's an old slug?
    // let slug_route = slug.split('/')[0]
    // if (type === 'exhibits') {
    //   const newSlug = exhibitLinks[slug]
    //   if (newSlug) {
    //     console.log(`Redirecting to new slug: ${newSlug}`)
    //     throw redirect(`/exhibits/${newSlug}`)
    //   }
    // } else if (type === 'collections') {

    //   const newSlug = collectionLinks[slug]
    //   if (newSlug) {
    //     console.log(`Redirecting to new slug: ${newSlug}`)
    //     throw redirect(`/collections/${newSlug}`)
    //   }
    // }
    // throw new Response('Page not found', {
    //   status: 404,
    //   statusText: `No ${type} called: ${slug}`,
    // })
  }
  return await fetch(
    `${process.env.WAGTAIL_HOST}/api/v2/${type}/${body.items[0].id}`
  ).then(res => res.json())
}
