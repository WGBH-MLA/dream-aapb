import { useLoaderData } from '@remix-run/react'
import Thumbnail from "../components/Thumbnail"
import { getRecord } from '../util/getRecord'
import { niceTitle } from '../util/niceTitle'

export const loader = async ({params, request}) => {
  let data = await getRecord(params.guid)
    console.log( 'hey its the data', data.hits.hits[0] )

  if(data && data.hits && data.hits.hits && data.hits.hits[0] && data.hits.hits[0]._source){
    return data.hits.hits[0]._source
  } else {
    return null
  }
}

export default function ShowRecord() {
  const data = useLoaderData()

  let title, description
  if(data){
    title = niceTitle(data.pbcoreDescriptionDocument.pbcoreTitle)
    if(data?.pbcoreDescriptionDocument?.pbcoreDescription[0] && data.pbcoreDescriptionDocument.pbcoreDescription[0]?.text){
      description = data.pbcoreDescriptionDocument.pbcoreDescription[0].text
    } else {
      description = "No Description Available"
    }
  }


  console.log( 'scwiption', description )
  return (
    <div className="skinny-body-container">

      <pre style={{ fontSize: "10px" }}>
        {JSON.stringify(data, null, 20)}
      </pre>


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

