import { useLoaderData } from '@remix-run/react'
import VideoPlayer from "../components/VideoPlayer"
import HeaderBar from "../components/HeaderBar"
import ShowBox from "../components/ShowBox"
import { getRecord } from '../util/getRecord'
import { niceTitle } from '../util/niceTitle'

export const loader = async ({params, request}) => {
  let data = await getRecord(params.guid)

  if(data){
    return data
  } else {
    return null
  }
}

export default function ShowRecord() {
  const data = useLoaderData()

  let people, orgs, identifiers
  let title, description, mediaType, eachId, producingOrg, creators, coverages
  if(data){
    title = niceTitle(data.pbcoreDescriptionDocument.pbcoreTitle)

    if(data?.pbcoreDescriptionDocument?.pbcoreDescription[0]){
      if(data.pbcoreDescriptionDocument.pbcoreDescription[0]?.text){
        // aapb currently takes the first description only, obv we can show more if we ant
        description = data.pbcoreDescriptionDocument.pbcoreDescription[0].text
      } else {
        description = "No Description Available"
      }

      description = <ShowBox label="Description" text={ description } />
    }

    if(data.media_type){
      mediaType = <ShowBox label="Media Type" text={ data.media_type } />
    }

    // orgs
    if(data.producing_org){
      producingOrg = <ShowBox label="Producing Organization" text={ data.producing_org } />
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
      creators = data.pbcoreDescriptionDocument.pbcoreCreator.map((pbc, i) => {
        if(pbc.creator && pbc.creatorRole && pbc.creatorRole.text && pbc.creatorRole.text != "Producing Organization"){
          return <ShowBox label={ pbc.creatorRole.text } text={ pbc.creator.text } />
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
      coverages = data.pbcoreDescriptionDocument.pbcoreCoverage.map((pbc, i) => {
        if(pbc.creatorRole && pbc.creatorRole.text != "Producing Organization"){
          return (
            <>
              <div className="show-metadata-header">Locations</div>
              <ShowBox label={ pbc.coverageType.text } text={ pbc.coverage.text } />
            </>
          )  
        }
      })
    }

    if(data.pbcoreDescriptionDocument.pbcoreIdentifier && data.pbcoreDescriptionDocument.pbcoreIdentifier.length > 0){
      eachId = data.pbcoreDescriptionDocument.pbcoreIdentifier.map((pbi) => {
        return <ShowBox label={ pbi.source || "Unknown ID" } text={ pbi.text } />
      })
    }

    if(eachId.length > 0){
      identifiers = (
        <>
          <div className="show-metadata-header">Identifiers</div>
          { eachId }
        </>
      )
      
    }
  }

  return (
    <>
      <div className="skinny-body-container">
        <HeaderBar title={ title} />

        <pre style={{ fontSize: "10px", display: "none" }}>
          {JSON.stringify(data, null, 20)}
        </pre>

        <div className="body-container">
          <div className="show-media">
            <VideoPlayer guid={ data.guid } />
          </div>
        </div>

        <div className="show-metadata-container">
          <div className="show-metadata-header">Info</div>
          { mediaType }
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

