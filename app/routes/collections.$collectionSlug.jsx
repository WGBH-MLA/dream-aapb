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
    title: "Fake Collection",
    content: [
      {
        id: "zvb9db7",
        type: "text",
        value: "it's a <b>BODY</b> thang...",
      },
      {
        id: "sdfjdb7",
        type: "text",
        value: "it'soh damnnnng! <img src='/silly.png' />",
      },      
      {
        id: "xxxdedf3",
        type: "credits",
        value: "and thats why we're giving YOU the <i>credit</i>",
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
