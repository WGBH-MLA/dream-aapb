import Thumbnail from "../components/Thumbnail"

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

export default function SearchResult({hit}){
  let guid, recordDate, date, producingOrg
  let pb_doc = hit.pbcoreDescriptionDocument

  let producing_org, media_type, title, description
  if(hit.producing_org){
    producing_org = hit.producing_org
  } else if(hit.asset && hit.asset[0] && hit.asset[0].producing_org && hit.asset[0].producing_org[0]){
    producing_org = hit.asset[0].producing_org[0]
  }
  
  if(hit.media_type){
    media_type = hit.media_type
  } else if(hit.asset && hit.asset[0] && hit.asset[0].media_type && hit.asset[0].media_type[0]){
    media_type = hit.asset[0].media_type[0]
  }

  if(hit.title){
    title = hit.title
  } else if(hit.asset && hit.asset[0] && hit.asset[0].title && hit.asset[0].title[0]){
    title = hit.asset[0].title[0]
  }

  guid = hit.guid

  let snippet
  if(hit.transcript_text){
    snippet = <div className="hit-transcript-snippet"><label>From Transcript:</label> {hit.transcript_text.slice(0,128) + "..."}</div>
  }

  if(hit.description){
    description = hit.description.slice(0, 500)
  } else if(hit.asset && hit.asset[0] && hit.asset[0].description && hit.asset[0].description[0]){
    description = hit.asset[0].description[0].slice(0, 500)
  }

  if(pb_doc){
    if(pb_doc.assetDate && pb_doc.assetDate.length > 0){
      // aapb convention is just first stored assetDate
      date = (<><b>Date:</b> { pb_doc.assetDate[0] }</>)
    }
  }

  if(producing_org){
    producingOrg = (<><b>Produced By:</b> { producing_org }</>)
  }

  return (
    <div className="search-result standard marbot">
      {/*TODO back to search link, with your query saved*/}
      <a href={`/catalog/${guid}`} >
        <div className="hit-thumbnail-container smarbot">
          <Thumbnail guid={ guid } searchResult={true} mediaType={ media_type } />
        </div>
      </a>

      <div className="hit-info-container">
        <div className="smarbot">
          <h3 className="hit-title "><a href={`/catalog/${guid}`} >{ title }</a></h3>
        </div>

        <div className="smarbot ">
          { date }
          { producingOrg }
        </div>

        <div className=" marbot">
          { description }
          { snippet }
        </div>
      </div>

      <hr />
    </div>
  )
}
