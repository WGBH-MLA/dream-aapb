import { useState } from 'react'
import { useLoaderData, useSearchParams } from 'react-router'
import VideoPlayer from "../components/VideoPlayer"
import HeaderBar from "../components/HeaderBar"
import ShowBox from "../components/ShowBox"
import { getRecord } from '../utils/getRecord'
import { niceTitle } from '../utils/niceTitle'

export const loader = async ({params, request}) => {
  // let esIndex = process.env.ES_INDEX || "hot-aapb"
  // let esURL = process.env.ES_URL || "https://elastic.dev.wgbh-mla.org"
  // let apiKey = process.env.ES_API_KEY || "bjVNcTVwc0JXX1JRWThNV091ZTc6WDdiUG0tVHl5dlE2M2dYaUctcnFodw=="
  let esIndex = "hot-aapb"
  let esURL = "https://elastic.dev.wgbh-mla.org"
  let apiKey = "bjVNcTVwc0JXX1JRWThNV091ZTc6WDdiUG0tVHl5dlE2M2dYaUctcnFodw=="

  let record = await getRecord(params.guid, esURL, esIndex, apiKey)
  let data = {
    record: record,
    esIndex: esIndex
  }
  if(data){
    return data
  } else {
    return null
  }
}

export default function ShowRecord() {
  const data = useLoaderData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showPbcore, setShowPbcore] = useState(false)
  
  let yourQuery = ""
  if(searchParams.get(`${data.esIndex}[query]`)){
    yourQuery = `?${data.esIndex}[query]=${searchParams.get(`${data.esIndex}[query]`)}`
  }

  let people, orgs, identifiers
  let title, description, mediaType, eachId, producingOrg, creators, coverages, dates, pbCore
  if(data){
    title = niceTitle(data.record.pbcoreDescriptionDocument.pbcoreTitle)

    if(data?.record?.pbcoreDescriptionDocument?.pbcoreDescription[0]){
      if(data.record.pbcoreDescriptionDocument.pbcoreDescription[0]?.text){
        // aapb currently takes the first description only, obv we can show more if we ant
        description = data.record.pbcoreDescriptionDocument.pbcoreDescription[0].text
      } else {
        description = "No Description Available"
      }

      description = <ShowBox label="Description" text={ description } />
    }

    if(data.record.media_type){
      mediaType = <ShowBox label="Media Type" text={ data.record.media_type } />
    }

    // orgs
    if(data.record.producing_org){
      producingOrg = <ShowBox label="Producing Organization" text={ data.record.producing_org } />
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
    if(data.record.pbcoreDescriptionDocument.pbcoreCreator && data.record.pbcoreDescriptionDocument.pbcoreCreator.length > 0){
      creators = data.record.pbcoreDescriptionDocument.pbcoreCreator.map((pbc, i) => {
        if(pbc.creator && pbc.creatorRole && pbc.creatorRole.text && pbc.creatorRole.text != "Producing Organization"){
          return <ShowBox label={ pbc.creatorRole.text } text={ pbc.creator.text } />
        }
      })

      creators = creators.filter((cre) => cre != undefined)
    }

    if(creators){
      people = (
        <>
          <div className="show-metadata-header">People</div>
          { creators }
        </>

      )
    }


    if(data.record.pbcoreDescriptionDocument.pbcoreCoverage && data.record.pbcoreDescriptionDocument.pbcoreCoverage.length > 0){
      coverages = data.record.pbcoreDescriptionDocument.pbcoreCoverage.map((pbc, i) => {
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

    if(data.record.pbcoreDescriptionDocument.pbcoreIdentifier && data.record.pbcoreDescriptionDocument.pbcoreIdentifier.length > 0){
      eachId = data.record.pbcoreDescriptionDocument.pbcoreIdentifier.map((pbi) => {
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

    if(data.record.pbcoreDescriptionDocument.pbcoreAssetDate && data.record.pbcoreDescriptionDocument.pbcoreAssetDate.length > 0){
      dates = (
        <>
          <div className="show-metadata-header">Dates</div>
          { data.record.pbcoreDescriptionDocument.pbcoreAssetDate.map((pbad) => <ShowBox label={ pbad.dateType } text={ pbad.text } />) }
        </>
      )
    }

    
    if(data.record.pbcoreDescriptionDocument){
      pbCore = (
        <>
          <div className="show-metadata-header">pbcoreDescriptionDocument</div>
          <pre>
            { JSON.stringify(data.record.pbcoreDescriptionDocument, null, 4) }
          </pre>
        </>
      )
    }
  }
  
  let pbClasses = "show-metadata-container bmarbot pbcore"
  if(showPbcore){
    pbClasses += " show"
  }

  return (
    <>
      <div className="page-container">
        <div className="skinny-body-container bmarbot">
          <HeaderBar title={ title} />
  
          <div className="show-media">
            <VideoPlayer guid={ data.record.guid } />
          </div>

          <div className="show-metadata-container bmarbot">
            <div className="show-metadata-header">Info</div>
            { mediaType }
            { description }
            { orgs }
            { identifiers }
            { people }
            { coverages }
            { dates }
          </div>

          <div className={ pbClasses } onClick={ () => setShowPbcore(!showPbcore) }>
            { pbCore }
          </div>
        </div>

        <div className="skinny-body-container">
          <a className="back-link martop marbot" href={ `/catalog${yourQuery}` }>&lt; Back To Search</a>
        </div>
      </div>

    </>
  )
}

function dateTypeName(type){
  switch(type){
    case "broadcast":
      return "Broadcast"
    case "air":
      return "Broadcast"
    case "issue":
      return "Broadcast"
    case "published":
      return "Broadcast"
    case "release":
      return "Broadcast"
    case "created":
      return "Created"
    case "recorded":
      return "Created"
    case "performance":
      return "Created"
    case "revised":
      return "Revised"
    case "copyright":
      return "Copyright Date"
  }
}