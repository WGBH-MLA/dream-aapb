import { useLoaderData } from 'react-router'
import { getPageBySlug } from '../utils/fetch'
import { renderCollection } from '../classes/collectionPresenter'
import { extractMeta } from '../utils/meta'

export const loader = async ({
  params,
  request,
}) => {

  let server_url = process.env.WAGTAIL_HOST
  let collection
  // collection = await getPageBySlug('collections', params.collectionSlug)
  collection = {
    title: "Regular Collection",
    summary: "Summarily wow wow wow!",
    background: "it's a <b>BODY</b> thang...",
    resources: "-what the heck<br>-what the heck<br>-what the heck<br>-what the heck<br>",
    thumbnail: {
      url: "/silly.png"
    },
    featured_items: [
      {
        title: "Great Item",
        img_url: "/silly.png",
        item_url: "www.google.com",
      },
      {
        title: "Good Item",
        img_url: "/silly.png",
        item_url: "www.google.com",
      },
      {
        title: "Eh Item",
        img_url: "/silly.png",
        item_url: "www.google.com",
      },
    ]
  }
  return { collection, server_url }
}

export const meta = ({ data }) => {
  let collection = data?.collection
  if (!collection) {
    return [
      { title: 'American Archive of Public Broadcasting' },
      {
        name: 'description',
        content: 'Special Collection from AAPB',
      },
    ]
  }
  return [
    { title: `${collection.title} | American Archive of Public Broadcasting` },
    {
      name: 'description',
      content:
        collection?.meta?.search_description || 'AAPB Collection',
    },
    ...extractMeta(data.server_url, collection),
  ]
}

export default function Collection() {
  const data = useLoaderData()
  return renderCollection(data.collection)
}
