import ScoreLight from "../components/ScoreLight"
import Thumbnail from "../components/Thumbnail"
import { niceTitle } from "../utils/helpers"

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

export default function ListResult({hit}){
  let guid, description, recordDate, date, producingOrg
  guid = aapbGuid(hit.pbcoreDescriptionDocument)
  if(hit.pbcoreDescriptionDocument){
    if(hit.pbcoreDescriptionDocument.assetDate && hit.pbcoreDescriptionDocument.assetDate.length > 0){
      // aapb convention is just first stored assetDate
      date = (<><b>Date:</b> { hit.pbcoreDescriptionDocument.assetDate[0] }</>)
    }

    if(hit.producing_org){
      producingOrg = (<><b>Produced By:</b> { hit.producing_org }</>)
    }

  }
  return (
    <div className="search-result list">
      <a href={`/catalog/${guid}`} >
        <div className="hit-thumbnail-container">
          <Thumbnail guid={ guid } searchResult={true} mediaType={ hit.media_type } />
        </div>
      </a>

      <div className="hit-info-container">
        <h3 className="hit-title ssmartop smarleft ssmarbot">
          <a href={`/catalog/${guid}`} >{ hit.title }</a>
        </h3>

        <div className="hit-details">
          { date }
          { producingOrg }
        </div>
      </div>
      <hr />
    </div>
  )
}
