import { useLoaderData } from '@remix-run/react'
import Thumbnail from "../components/Thumbnail"
import { getRecord } from '../util/getRecord'
import { niceTitle } from '../util/niceTitle'

export const loader = async ({params, request}) => {
  let data = await getRecord(params.guid)
  if(data && data.hits && data.hits.hits && data.hits.hits[0]){
    return data.hits.hits[0]._source
  } else {
    return null
  }
}

export default function Collection() {
  const data = useLoaderData()

  let title, description
  if(data){
    title = niceTitle(data.pbcoreTitle)
    description = data.pbcoreDescription && data.pbcoreDescription[0] ? data.pbcoreDescription[0] : "No Description Available"
  }
  return (
    <div className="skinny-body-container">
      <div className="show-title">
        <h2>{ title }</h2>
      </div>

      <div className="show-media">
        <Thumbnail guid={ data.guid } />
      </div>

      <div className="show-description">
        { description }
      </div>
    </div>

  )
}

