import ScoreLight from "../components/ScoreLight"
import Thumbnail from "../components/Thumbnail"
import { niceTitle } from "../util/niceTitle"

function aapbGuid(descdoc){
  if(descdoc && descdoc.pbcoreIdentifier && descdoc.pbcoreIdentifier.length > 0){
    var guidNode = descdoc.pbcoreIdentifier.find((pbcoreId) => pbcoreId.source == "http://americanarchiveinventory.org")
    if(guidNode && guidNode.text){
      return guidNode.text.replace("/", "-")
    }
  }
}

function resultDescription(descriptions){
  if(descriptions.length > 0 && descriptions[0].text && descriptions[0].text.toLowerCase() !== "no description available"){
    return `${descriptions[0].text.substring(0, 500)}`
  } else {
    return ""
  }
}

function producingOrganization(creators){
  return creators ? creators.find(creator => creator.creatorRole?.[0] == "Producing Organization").creator : null 
}

export default function GalleryResult({hit}){
  let guid = aapbGuid(hit.pbcoreDescriptionDocument)
  let date, producingOrg
  if(hit.pbcoreDescriptionDocument.assetDate && hit.pbcoreDescriptionDocument.assetDate.length > 0){
    // aapb convention is just first stored assetDate
    date = (<><b>Date:</b> { hit.pbcoreDescriptionDocument.assetDate[0] }</>)
  }

  if(hit.pbcoreDescriptionDocument.pbcoreCreator && hit.pbcoreDescriptionDocument.pbcoreCreator.length > 0){
    // this needs to be changed to a field producing_org that will be at the top level
    producingOrg = (<><b>Produced By:</b> { hit.producing_org }</>)
  }

  return (
    <div className="search-result gallery">
      <a href={`/search/${guid}`} >
        <div className="hit-thumbnail-container">
          <Thumbnail guid={ guid } searchResult={true} mediaType={ hit.media_type } data={hit} />
          <h3 className="hit-title ssmartop smarleft ssmarbot"><a href={`/search/${guid}`} >{ hit.title }</a></h3>
        </div>
      </a>
    </div>
  )
}
