import { useLoaderData } from '@remix-run/react'
import VideoPlayer from "../components/VideoPlayer"
import { getRecord } from '../util/getRecord'
import { niceTitle } from '../util/niceTitle'

export const loader = async ({params, request}) => {
  let data = await getRecord(params.guid)
    console.log( 'hey its the data', data.hits.hits[0] )

  if(data && data.hits && data.hits.hits && data.hits.hits[0] && data.hits.hits[0]._source){
    console.log( 'fuckin', data.hits.hits[0] )
    return data.hits.hits[0]._source
  } else {
    return null
  }
}

export default function ShowRecord() {
  const data = useLoaderData()

  let title, description, identifiers, producingOrg, creators, coverages
  if(data){
    title = niceTitle(data.pbcoreDescriptionDocument.pbcoreTitle)
    if(data?.pbcoreDescriptionDocument?.pbcoreDescription[0] && data.pbcoreDescriptionDocument.pbcoreDescription[0]?.text){
      description = data.pbcoreDescriptionDocument.pbcoreDescription[0].text
    } else {
      description = "No Description Available"
    }

    if(data.producing_org){
      producingOrg = (
        <div className="show-box">
          <label>Producing Organization</label>
          { data.producing_org }
        </div>
      )
    }

    if(data.pbcoreDescriptionDocument.pbcoreCreator && data.pbcoreDescriptionDocument.pbcoreCreator.length > 0){
      creators = data.pbcoreDescriptionDocument.pbcoreCreator.map((pbc) => {
        if(pbc.creatorRole && pbc.creatorRole.text != "Producing Organization")
        return (
          <div className="show-box">
            <label>{ pbc.creatorRole.text }</label>
            { pbc.creator.text }
          </div>
        )
      })
    }

    if(data.pbcoreDescriptionDocument.pbcoreCoverage && data.pbcoreDescriptionDocument.pbcoreCoverage.length > 0){
      creators = data.pbcoreDescriptionDocument.pbcoreCoverage.map((pbc) => {
        if(pbc.creatorRole && pbc.creatorRole.text != "Producing Organization"){
          return (
            <div className="show-box">
              <label>{ pbc.creatorRole.text }</label>
              { pbc.creator.text }
            </div>
          )  
        }
      })
    }

    if(data.pbcoreDescriptionDocument.pbcoreIdentifier && data.pbcoreDescriptionDocument.pbcoreIdentifier.length > 0){
      creators = data.pbcoreDescriptionDocument.pbcoreIdentifier.map((pbi) => {
        return (
          <div className="show-box">
            <label>{ pbi.source.text }</label>
            { pbi.text }
          </div>
        )
      })
    }
  }


  return (
    <>
      <div className="skinny-body-container">
        
        <div className="show-top-bar">
          <div className="show-title">
            <h2>{ title }</h2>
            <hr />
          </div>
        </div>

        <pre style={{ fontSize: "10px", display: "block" }}>
          {JSON.stringify(data, null, 20)}
        </pre>

        <div className="body-container">
          <div className="show-media">
            <VideoPlayer guid={ data.guid } />
          </div>
        </div>


        <div className="show-metadata-container">
          <div className="show-metadata-header">Info</div>
          { identifiers }
          { producingOrg }
          { creators }
          { coverages }
        </div>
      </div>
    </>
  )
}

