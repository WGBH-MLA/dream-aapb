import { useEffect, useState } from "react"
import { useLoaderData, useSearchParams, Link } from 'react-router'

import VideoPlayer from "../components/VideoPlayer"
import HeaderBar from "../components/HeaderBar"
import ShowBox from "../components/ShowBox"
import TranscriptViewer from "../components/TranscriptViewer"
import Viewer from "../components/Viewer"
import { getRecord } from '../utils/getRecord'
import Record from '../utils/Record'
import { niceTitle, dateTypeName, notEmpty, normalizeGuid } from '../utils/helpers'
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

  let guid = normalizeGuid(params.guid)

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

  console.log( 'playability was', access.canPlay() && record.hasPlayableMedia() )

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
  // const [mediaURL, setMediaURL] = useState(data.mediaURL)

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
        wide={ record.is169() }
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

  let credits, orgs, identifiers
  let title, descriptionsByType, titlesByType, mediaType, eachId, producingOrg, contributingOrgs, creators, coverages, dates, pbCore, instantiations, subjects, duration, assetTypes, topics
  let transcript
  let videoPlayerClasses = "media-area-container"

  if(data){

    title = record.title

    // descriptions = record.descriptionsByType()
    // if(descriptions){
    //   descriptions = <ShowBox label="Descriptions" text={ descriptions } />
    // }

    descriptionsByType = record.descriptionsByType()
    if(descriptionsByType){
      descriptionsByType = (
        <>
          { descriptionsByType.map((pbd, i) => <ShowBox key={i} label={ pbd.descriptionType } text={ pbd.text } />) }
        </>
      )
    }
    
    titlesByType = record.titlesByType()
    if(titlesByType){
      titlesByType = (
        <>
          { titlesByType.map((pbt, i) => <ShowBox key={i} label={ pbt.titleType } text={ pbt.text } />) }
        </>
      )
    }

    if(record.media_type){
      mediaType = <ShowBox label="Media Type" text={ record.media_type } />
    }

    if(record.media_type){
      mediaType = <ShowBox label="Media Type" text={ record.media_type } />
    }

    // orgs
    if(notEmpty(record.contributing_orgs)){
      contributingOrgs = [...new Set(record.contributing_orgs)]
      contributingOrgs = contributingOrgs.filter((co) => co != "American Archive of Public Broadcasting").map((co) => <ShowBox label="Contributing Organization" text={ co } />)
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

    if(notEmpty(record.pbcoreDescriptionDocument.pbcoreSubject)){
      subjects = <ShowBox key="subjects" label="Subjects" text={ record.pbcoreDescriptionDocument.pbcoreSubject.map((ps) => ps.text).join('; ') } />
    }

    if(notEmpty(record.pbcoreDescriptionDocument.pbcoreAssetType)){
      // could technically be multiple
      assetTypes = <ShowBox key="assettypes" label="Asset Type" text={ record.pbcoreDescriptionDocument.pbcoreAssetType.map((pbat) => pbat.text).join(', ') } />
    }

    if(notEmpty(record.topics)){
      // could technically be multiple
      topics = <ShowBox key="topics" label="Topics" text={ record.topics.map((topic) => <Link to={ `/catalog?topics[]=${topic}` }>{topic}</Link> ) } />
    }

    if(notEmpty(record.pbcoreDescriptionDocument.pbcoreAssetType)){
      // could technically be multiple
      assetTypes = <ShowBox key="assettypes" label="Asset Type" text={ record.pbcoreDescriptionDocument.pbcoreAssetType.map((pbat) => pbat.text).join(', ') } />
    }

    let duration = record.duration()
    if(duration){
      assetTypes = <ShowBox key="duration" label="Duration" text={ duration } />
    }

    // credits
    // creators = record.creators()
    // if(notEmpty(creators)){

    //   creators = creators.map((pbc, i) => <ShowBox key={i} label={ pbc.creatorRole[0].text } text={ pbc.creator.text } />)
    //   credits = (
    //     <>
    //       <div className="show-metadata-header">Creators</div>
    //       { creators }
    //     </>
    //   )
    // }
    function role(entity){
      if(entity){
        if(entity.creatorRole && entity.creatorRole[0]){
          return entity.creatorRole[0].text
        } else if(entity.contributorRole && entity.contributorRole[0]){
          return entity.contributorRole[0].text
        } else if(entity.publisherRole && entity.publisherRole[0]){
          return entity.publisherRole[0].text
        }   
      }
    }

    function name(entity){
      if(entity){
        if(entity.creator){
          return entity.creator.text
        } else if(entity.contributor){
          return entity.contributor.text
        } else if(entity.publisher){
          return entity.publisher.text
        }   
      }
    }

    credits = record.credits()
    if(notEmpty(credits)){
      credits = credits.map((entity, i) => <ShowBox key={i} label={ role(entity) } text={ name(entity) } />)
      credits = (
        <>
          <div className="show-metadata-header">Credits</div>
          { credits }
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

    if(transcriptData){
      transcript = <>
        <div className="media-area-container"> 
          <div className="transcript-viewer-container">
            { transcriptViewer }
          </div>
        </div>
      </>  
    } else {
      videoPlayerClasses += " full"
    }
    
  }

  return (
    <>
      <div className="page-container">
        <div className="skinnier-body-container page-title">
          <HeaderBar title={ title } />
        </div>

        <div className="skinnier-body-container bmarbot martop video-area">
  
          <div id="show-media" className="marbot">
            <div className={ videoPlayerClasses }> 
              <VideoPlayer
                guid={ record.guid }
                title={ record.title }
                mediaURL={ data.mediaURL }
                adHLSURL={ data.adHLSURL }
                captionURL={ data.captionURL }
              />
            </div>
            { transcript }
          </div>


          <div className="show-metadata-container smarbot">
            <div className="show-metadata-header">Info</div>
            { titlesByType }
            { orgs }
            { contributingOrgs }
          </div>

          <div className="show-metadata-container smarbot">
            <div className="show-metadata-header">Description</div>
            {/*regular info list*/}
            { mediaType }
            { subjects }
            { assetTypes }
            { topics }
            { duration }
    
            {/*addl optional sections*/}
            { identifiers }
            { credits }
            { coverages }
            { dates }
          </div>

          <div className="show-metadata-container smarbot">
            <div className="show-metadata-header">Descriptions</div>
            { descriptionsByType }
          </div>

          <div className="show-metadata-container bmarbot">
            <div className="show-metadata-header">Contributor Holdings</div>
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
