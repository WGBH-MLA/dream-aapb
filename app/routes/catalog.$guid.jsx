import { useEffect, useState } from "react"
import { useLoaderData, useSearchParams, useOutletContext, Link } from "react-router"

import Accordion from "../components/Accordion"
import VideoPlayer from "../components/VideoPlayer"
import HeaderBar from "../components/HeaderBar"
import ShowBox from "../components/ShowBox"
import TranscriptViewer from "../components/TranscriptViewer"
import Viewer from "../components/Viewer"
import RelatedRecords from "../components/RelatedRecords"
import Agreement from "../components/Agreement"

import { getRecord } from '../utils/getRecord'
import Record from '../utils/Record'
import { niceTitle, dateTypeName, notEmpty, normalizeGuid, pageTitle } from '../utils/helpers'
import { getCiToken, getCiMediaURL } from '../utils/media'
import { getAD, getCaption, getTranscript, getTranscriptData } from '../utils/sidecarFetchers'
import Citations from "../components/Citations"
import VideoHound from '../classes/VideoHound'
import Access from '../classes/Access'
import Location from '../classes/Location'
import MoreLikeThis from "../classes/MoreLikeThis"

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
  let location = await Location.getGeocode(request)

  // get access level based on record and location
  let access = new Access(request, location, record)

  // does user have agreement cookie
  data.hasAgreed = await access.hasAgreed(request)

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

    // retrieve more like this from es
    let config = {
      esURL: process.env.ES_URL,
      esIndex: process.env.ES_INDEX,
      esAPIKey: process.env.ES_API_KEY
    }

    let mlt_fields = [

      // adding too many fields to MLT causes no results, because mlt makes 'master term list', and more fields means more overall text so noisier matching
      // "description",

      // "title",
      "all_titles",
      // "pbcoreDescriptionDocument.pbcoreSubject.text",
      // "pbcoreDescriptionDocument.pbcoreDescription.text",
      // "pbcoreDescriptionDocument.pbcoreGenre.text",
      // "pbcoreDescriptionDocument.pbcoreRelation.pbcoreRelationIdentifier.text",
      // "pbcoreDescriptionDocument.pbcoreCoverage.coverage.text",
      // "pbcoreDescriptionDocument.pbcoreCreator.creator.text",
      // "pbcoreDescriptionDocument.pbcoreContributor.contributor.text",
      // "pbcoreDescriptionDocument.pbcorePublisher.publisher.text",
      // "pbcoreDescriptionDocument.pbcoreAnnotation.text",
    ]
    // let relatedRecordsTitle = await new MoreLikeThis(config).getMoreLikeThis( [record.id], mlt_fields )
    // mlt_fields = [
    //   "pbcoreDescriptionDocument.pbcoreDescription.text",
    // ]
    // let relatedRecordsDescription = await new MoreLikeThis(config).getMoreLikeThis( [record.id], mlt_fields )
    // console.log( 'desc', relatedRecordsDescription )
    // data.related_records = relatedRecordsTitle.concat(relatedRecordsDescription)

    data.related_records = await new MoreLikeThis(config).getMoreLikeThis([record.id], ["title"])
  }

  return data
}

export const action = async ({request}) => {
  // set the agreefunction as our server-side form action so its picked up when we submit the Form in the Agreement component
  return await Access.agree(request)
}

export default function ShowRecord() {
  const data = useLoaderData()

  let agreementUI
  if(!data.hasAgreed){
    agreementUI = <Agreement agreement={ data.hasAgreed } />
  }

  const { pagedata, setPagedata } = useOutletContext()
  const [viewerOpen, setViewerOpen] = useState(true)
  const [transcriptData, setTranscriptData] = useState(false)

  const handleViewerToggle = (e) => {
    setViewerOpen(!viewerOpen)
  }

  const withSuffix = (label, suffix) => {
    if (!label) return suffix
    return label.toLowerCase().endsWith(suffix.toLowerCase()) ? label : `${label} ${suffix}`
  }

  useEffect(() => {
    // only run on first load
    setPagedata({title: pageTitle(record.title)})
  }, [])

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
  let title, descriptionsByType, titlesByType, mediaType, eachId, producingOrg, contributingOrgs, creators, coverages, dates, pbCore, instantiations, subjects, duration, assetTypes, topics, relatedRecords
  let transcript
  let videoPlayerClasses = "media-area-container"

  if(data){

    title = record.title

    descriptionsByType = record.descriptionsByType()
    if(descriptionsByType){
      descriptionsByType = (
        <>
          { descriptionsByType.map((pbd, i) => <ShowBox key={i} label={withSuffix(pbd.descriptionType, "Description")} text={pbd.text} />) }
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

    // orgs
    if(notEmpty(record.contributing_orgs)){
      contributingOrgs = [...new Set(record.contributing_orgs)]
      contributingOrgs = contributingOrgs.filter((co) => co != "American Archive of Public Broadcasting").map((co) => <ShowBox key={ co } label="Contributing Organization" text={ co } />)
    }

    // orgs
    if(record.producing_org){
      producingOrg = <ShowBox label="Producing Organization" text={ record.producing_org } />
    }

    if(producingOrg){
      orgs = producingOrg
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
      topics = <ShowBox key="topics" label="Topics" text={ record.topics.map((topic) => <Link key={ topic } to={ `/catalog?topics[]=${topic}` }>{topic}</Link> ) } />
    }

    let duration = record.duration()
    if(duration){
      duration = <ShowBox key="duration" label="Duration" text={ duration } />
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
      const isAapbSource = (source) =>
        !!source &&
        source.trim().toLowerCase().replace(/^https?:\/\//, "").startsWith("americanarchive")

      const aapbBoxes = record.pbcoreDescriptionDocument.pbcoreIdentifier
        .filter((pbi) => isAapbSource(pbi.source) && pbi.text)
        .map((pbi, i) => <ShowBox key={`aapb-${i}`} label="AAPB ID" text={pbi.text} />)

      if(aapbBoxes.length > 0){
        identifiers = <>{aapbBoxes}</>
      }
    }

    if(notEmpty(record.pbcoreDescriptionDocument.pbcoreAssetDate)){
      dates = (
        <>
          {record.pbcoreDescriptionDocument.pbcoreAssetDate.map((pbad, i) => <ShowBox key={i} label={dateTypeName(pbad.dateType)} text={pbad.text} />)}
        </>
      )
    }

    if(record.pbcoreDescriptionDocument){
      pbCore = JSON.stringify(record.pbcoreDescriptionDocument, null, 4)
    }

    instantiations = record.instantiations()
    if(instantiations){
      instantiations = instantiations.map((inst, i) => inst.blurb(i))
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

    if(notEmpty(data.related_records)){
      relatedRecords = (
        <div className="show-metadata-container related-records-container marbot">
          <div className="show-metadata-header">Related Records</div>
          <RelatedRecords records={ data.related_records } />
        </div>
      )
    }
  }

  return (
    <>
      { agreementUI }

      <div className="page-container">
        <div className="body-container page-title">
          <HeaderBar title={title} />
        </div>

        <div className="skinny-body-container bmarbot martop video-area">

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

          <div className="show-columns">

            <div className="show-left-col">
              { titlesByType }
              { orgs }
              { contributingOrgs }
              { identifiers }
            </div>

            <div className="show-right-col">
              <Accordion title="Description" defaultOpen={true}>
                { descriptionsByType }
                { mediaType }
                { assetTypes }
                { subjects }
                { topics }
                { duration }
                { coverages }
                { dates }
              </Accordion>

              <Accordion title="Credits">
                { credits }
              </Accordion>

              <Accordion title="AAPB Contributor Holdings">
                { instantiations }
                <div className="catalog-alert-box">
                  If you have a copy of this asset and would like us to add it to our catalog, please <a href="/contact-us">contact us</a>.
                </div>
              </Accordion>

              <Accordion title="Citations">
                <Citations record={ record } />
              </Accordion>
            </div>
          </div>

          { relatedRecords }
        </div>
      </div>
    </>
  )
}