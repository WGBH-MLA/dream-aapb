import { useLoaderData } from '@remix-run/react'
import VideoPlayer from "../components/VideoPlayer"
import HeaderBar from "../components/HeaderBar"
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

  let people, orgs
  let title, description, identifiers, producingOrg, creators, coverages
  if(data){
    title = niceTitle(data.pbcoreDescriptionDocument.pbcoreTitle)

    if(data?.pbcoreDescriptionDocument?.pbcoreDescription[0]){
      if(data.pbcoreDescriptionDocument.pbcoreDescription[0]?.text){
        // aapb currently takes the first description only, obv we can show more if we ant
        description = data.pbcoreDescriptionDocument.pbcoreDescription[0].text
      } else {
        description = "No Description Available"
      }

      description = (
        <div className="show-box">
          <label>Description</label>
          { description }
        </div>
      )
    }
    

    // orgs
    if(data.producing_org){
      producingOrg = (
        <div className="show-box">
          <label>Producing Organization</label>
          { data.producing_org }
        </div>
      )
    }

    if(producingOrg){
      orgs = (
        <>
          <div className="show-metadata-header">Organizations</div>
          { producingOrg }
        </>
      )
    }

    // people
    if(data.pbcoreDescriptionDocument.pbcoreCreator && data.pbcoreDescriptionDocument.pbcoreCreator.length > 0){
      creators = data.pbcoreDescriptionDocument.pbcoreCreator.map((pbc) => {
        if(pbc.creator && pbc.creatorRole && pbc.creatorRole.text && pbc.creatorRole.text != "Producing Organization"){
          return (
            <div className="show-box">
              <label>{ pbc.creatorRole.text }</label>
              { pbc.creator.text }
            </div>
          )
        }
      })

      creators = creators.filter((cre) => cre != undefined)
      creators = creators.join("\n")
    }

    if(creators){
      people = (
        <>
          <div className="show-metadata-header">People</div>
          { creators }
        </>

      )
    }


    if(data.pbcoreDescriptionDocument.pbcoreCoverage && data.pbcoreDescriptionDocument.pbcoreCoverage.length > 0){
      coverages = data.pbcoreDescriptionDocument.pbcoreCoverage.map((pbc) => {
        if(pbc.creatorRole && pbc.creatorRole.text != "Producing Organization"){
          return (
            <>
              <div className="show-metadata-header">Locations</div>
              <div className="show-box">
                <label>{ pbc.coverageType.text }</label>
                { pbc.coverage.text }
              </div>
            </>
          )  
        }
      })
    }

    if(data.pbcoreDescriptionDocument.pbcoreIdentifier && data.pbcoreDescriptionDocument.pbcoreIdentifier.length > 0){
      identifiers = data.pbcoreDescriptionDocument.pbcoreIdentifier.map((pbi) => {
        return (
          <>
            <div className="show-metadata-header">Identifiers</div>
            <div className="show-box">
              <label>{ pbi.source || "Unknown ID" }</label>
              { pbi.text }
            </div>
          </>
        )
      })
    }

  }


  return (
    <>
      <div className="skinny-body-container">
        <HeaderBar title={ title} />

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
          { description }

          { orgs }

          { identifiers }

          { people }

          { coverages }
        </div>
      </div>
    </>
  )
}

