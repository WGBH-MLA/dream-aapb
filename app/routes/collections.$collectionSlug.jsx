import { useLoaderData } from 'react-router'
import { getPageBySlug } from '../utils/fetch'
import { getRecords } from '../utils/getRecord'
import { renderCollection } from '../classes/collectionPresenter'
import { extractMeta } from '../utils/meta'

export const loader = async ({
  params,
  request,
}) => {

  // let serverURL = process.env.AAPB_API_URL || "http://aapb-api/api/v2"
  // let esIndex = process.env.ES_INDEX || "hot-aapb"
  // let esURL = process.env.ES_URL || "https://elastic.dev.wgbh-mla.org"
  // let apiKey = process.env.ES_API_KEY || "bjVNcTVwc0JXX1JRWThNV091ZTc6WDdiUG0tVHl5dlE2M2dYaUctcnFodw=="
  let serverURL = "http://aapb-api/api/v2"
  let esIndex = "hot-aapb"
  let esURL = "https://elastic.dev.wgbh-mla.org"
  let apiKey = "bjVNcTVwc0JXX1JRWThNV091ZTc6WDdiUG0tVHl5dlE2M2dYaUctcnFodw=="
  
  let collection
  collection = await getPageBySlug('aapb_collections.AAPBCollection', params.collectionSlug)

  let featuredRecords = {}
  if(collection.featured_items.length > 0){
    // collect the guids they said
    let featured_guids = collection.featured_items.map((item) => item.value.guids[0])

    // get some records they said
    let records = await getRecords(featured_guids, esURL, esIndex, apiKey)

    // make a freakin dictionary they said
    records.forEach((record) => featuredRecords[record.guid] = record)

    // mix it back in to the collection they said
    collection.featuredRecords = featuredRecords
  }

  return { collection, serverURL, esIndex, esURL, apiKey }
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
      charset: "utf-8"
    },
    ...extractMeta(data.serverURL, collection),
  ]
}

export default function Collection() {
  const data = useLoaderData()
  const esConfig = {
    esURL: data.esURL,
    esIndex: data.esIndex,
    apiKey: data.apiKey,
  }
  return renderCollection(data.collection, esConfig)
}
