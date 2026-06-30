import { useEffect, useState } from "react"
import { useLoaderData, useSearchParams } from 'react-router'

import VideoPlayer from "../components/VideoPlayer"
import HeaderBar from "../components/HeaderBar"
import ShowBox from "../components/ShowBox"
import TranscriptViewer from "../components/TranscriptViewer"
import Viewer from "../components/Viewer"
import { getRecord } from '../utils/getRecord'
import Record from '../utils/Record'
import { niceTitle, dateTypeName, notEmpty } from '../utils/helpers'
import { getCiToken, getCiMediaURL } from '../utils/media'
import { getAD, getCaption, getTranscript, getTranscriptData } from '../utils/sidecarFetchers'
import VideoHound from '../classes/VideoHound'
import Access from '../classes/Access'
import Location from '../classes/Location'

export const loader = async ({params, request}) => {
  let esIndex = process.env.ES_INDEX
  let esURL = process.env.ES_URL
  let esAPIKey = process.env.ES_API_KEY

  let data = {}
  let guid = params.guid

  // get record from es
  let recordData = await getRecord(guid, esURL, esIndex, esAPIKey)
  
  if(!recordData){
    throw `Asset ${guid} was not found!!`
  } else {
    data.recordData = recordData
    data.mediaURL = null
    data.esIndex = esIndex  
  }

  // fill presenter model with record data
  let record = new Record(data.recordData)
  // check location from IP
  let location = new Location(request)
  // get access level based on record and location
  let access = new Access(record, location)

  if( access.canPlay() && record.hasPlayableMedia() ){

    let ciConfig = {
      ciAPIHost: process.env.SONY_CI_API_HOST,
      ciWorkspaceId: process.env.SONY_CI_WORKSPACE_ID,
      ciUser: process.env.SONY_CI_USERNAME,
      ciPassword: process.env.SONY_CI_PASSWORD,
      ciClientId: process.env.SONY_CI_CLIENT_ID,
      ciClientSecret: process.env.SONY_CI_CLIENT_SECRET,
    }

    // retrieve media url from ci
    let mediaURL = await new VideoHound(ciConfig).findMedia( record.ciID, record.isVideo() )
    data.mediaURL = mediaURL

    // check for audio description
    let adHLSURL = await getAD(record.guid)
    if(adHLSURL){
      data.adHLSURL = adHLSURL
    }

    // check for caption file
    let captionURL = await getCaption(record.guid)
    if(captionURL){
      data.captionURL = captionURL
    }

    // check for transcript file
    let transcriptURL = await getTranscript(record.guid)
    if(transcriptURL){
      // url returned only if its there
      data.transcriptURL = transcriptURL
    }
  }

  return data
}

export default function ShowRecord() {
  const data = useLoaderData()

  const [viewerOpen, setViewerOpen] = useState(true)

  const [transcriptData, setTranscriptData] = useState(false)

  const handleViewerToggle = (e) => {
    setViewerOpen(!viewerOpen)
  }
  
  useEffect(() => {
    if(viewerOpen && data.transcriptURL && !transcriptData){
      getTranscriptData(data.transcriptURL).then( (lines) => setTranscriptData(lines) )
    }
  })

  // class instance cant survive ssr serialization, so do it again
  let record = new Record(data.recordData)

  let transcriptViewer
  if(data.transcriptURL){
    transcriptViewer = (
      <TranscriptViewer
        lines={ transcriptData }
        viewerOpen={ viewerOpen }
        handleViewerToggle={ handleViewerToggle }
      />
    )  
  }
  

  // toggle show of raw pbcore json
  const [showPbcore, setShowPbcore] = useState(false)

  // preserve link back to users referring search (if available), via url params
  const [searchParams, setSearchParams] = useSearchParams()
  let yourQuery = ""
  if(searchParams.get(`${data.esIndex}[query]`)){
    yourQuery = `?${data.esIndex}[query]=${searchParams.get(`${data.esIndex}[query]`)}`
  }

  let people, orgs, identifiers
  let title, description, mediaType, eachId, producingOrg, creators, coverages, dates, pbCore, instantiations
  if(data){

    title = record.title

    description = record.description()
    if(description){
      description = <ShowBox label="Description" text={ description } />
    }

    if(record.media_type){
      mediaType = <ShowBox label="Media Type" text={ record.media_type } />
    }

    // orgs
    if(record.producing_org){
      producingOrg = <ShowBox label="Producing Organization" text={ record.producing_org } />
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
    creators = record.creators()
    if(creators){

      creators = creators.map((pbc, i) => <ShowBox key={i} label={ pbc.creatorRole[0].text } text={ pbc.creator.text } />)
      people = (
        <>
          <div className="show-metadata-header">People</div>
          { creators }
        </>
      )
    }

    if(notEmpty(record.pbcoreDescriptionDocument.pbcoreCoverage)){
      coverages = record.pbcoreDescriptionDocument.pbcoreCoverage.map((cov, i) => {
        return (
          <>
            <div className="show-metadata-header">Locations</div>
            <ShowBox key={i} label={ cov.coverageType.text } text={ cov.coverage.text } />
          </>
        )  
      })
    }

    if(notEmpty(record.pbcoreDescriptionDocument.pbcoreIdentifier)){
      eachId = record.pbcoreDescriptionDocument.pbcoreIdentifier.map((pbi, i) => {
        return <ShowBox key={i} label={ pbi.source || "Unknown ID" } text={ pbi.text } />
      })

      if(eachId.length > 0){
        identifiers = (
          <>
            <div className="show-metadata-header">Identifiers</div>
            { eachId }
          </>
        )
      }
    }

    if(notEmpty(record.pbcoreDescriptionDocument.pbcoreAssetDate)){
      dates = (
        <>
          <div className="show-metadata-header">Dates</div>
          { record.pbcoreDescriptionDocument.pbcoreAssetDate.map((pbad, i) => <ShowBox key={i} label={ dateTypeName(pbad.dateType) } text={ pbad.text } />) }
        </>
      )
    }

    if(record.pbcoreDescriptionDocument){
      pbCore = JSON.stringify(record.pbcoreDescriptionDocument, null, 4)
    }

    instantiations = record.instantiations()
    if(instantiations){
      instantiations = instantiations.map((inst) => inst.blurb() )
    }
  }
  
  return (
    <>
      <div className="page-container">
        <div className="skinnier-body-container page-title">
          <HeaderBar title={ title } />
        </div>

        <div className="skinnier-body-container bmarbot martop video-area">
  
          <div id="show-media" className="bmarbot">
            <div className="media-area-container"> 
              <VideoPlayer
                guid={ record.guid }
                title={ record.title }
                mediaURL={ data.mediaURL }
                adHLSURL={ data.adHLSURL }
                captionURL={ data.captionURL }
              />
            </div>
            <div className="media-area-container"> 
              <div className="transcript-viewer-container">
                { transcriptViewer }
              </div>
            </div>
          </div>


          <div className="show-metadata-container smarbot">
            <div className="show-metadata-header">Info</div>
            { mediaType }
            { description }
            { orgs }
            { identifiers }
            { people }
            { coverages }
            { dates }
          </div>

          <div className="show-metadata-container bmarbot">
            <div className="show-metadata-header">Instantiations</div>
            { instantiations }
          </div>

          <div className="pbcore-viewer-container">
            <Viewer label="PBCore Metadata" guid={ record.guid } content={ pbCore } showContent={ showPbcore } setShowContent={ setShowPbcore } />
          </div>
        </div>
        <div className="skinnier-body-container">
          <a className="back-link martop marbot" href={ `/catalog${yourQuery}` }>&lt; Back To Search</a>
        </div>
      </div>
    </>
  )
}
