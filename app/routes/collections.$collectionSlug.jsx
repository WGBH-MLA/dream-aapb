import { useLoaderData } from 'react-router'
import { getPageBySlug } from '../utils/fetch'
import { renderCollection } from '../classes/collectionPresenter'
import { extractMeta } from '../utils/meta'

export const loader = async ({
  params,
  request,
}) => {

  let server_url = process.env.WAGTAIL_HOST
  let indexName = process.env.ES_INDEX
  let esURL = process.env.ES_URL
  let apiKey = process.env.ES_API_KEY

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
    tag: "fridaynightjazz",
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
    ],
  }
  return { collection, server_url, indexName, esURL, apiKey }
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
  const esConfig = {
    esURL: data.esURL,
    indexName: data.indexName,
    apiKey: data.apiKey,
  }
  return renderCollection(data.collection, esConfig)
}
