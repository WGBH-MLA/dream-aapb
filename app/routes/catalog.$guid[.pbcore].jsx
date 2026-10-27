import { useLoaderData } from 'react-router'
import { getRecord } from '../utils/getRecord'
import { normalizeGuid } from '../utils/helpers'

export const loader = async ({params, request}) => {
  let esIndex = process.env.ES_INDEX
  let esURL = process.env.ES_URL
  let esAPIKey = process.env.ES_API_KEY

  let data = {}
  let guid = normalizeGuid(params.guid)
  let recordData = await getRecord(guid, esURL, esIndex, esAPIKey)
  
  return new Response(JSON.stringify(recordData.pbcoreDescriptionDocument, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  })
}
