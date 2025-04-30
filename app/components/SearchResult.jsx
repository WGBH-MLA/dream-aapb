import ScoreLight from "../components/ScoreLight"
import Thumbnail from "../components/Thumbnail"

function aapbGuid(descdoc){
  if(descdoc && descdoc.pbcoreIdentifier && descdoc.pbcoreIdentifier.length > 0){
    var guidNode = descdoc.pbcoreIdentifier.find((pbcoreId) => pbcoreId.source == "http://americanarchiveinventory.org")
    if(guidNode && guidNode.text){
      return guidNode.text.replace("/", "-")
    }
  }
}

function niceTitle(titles){
  var displayTitles
  var seriesTitles = titles.filter((titleNode) => titleNode.type == "Series").map((node) => node.text)
  var episodeTitles = titles.filter((titleNode) => titleNode.type == "Episode").map((node) => node.text)
  var episodeNumbers = titles.filter((titleNode) => titleNode.type == "Episode Number").map((node) => node.text)

  if(seriesTitles.length > 1 && episodeNumbers.length > 0 && episodeTitles.length > 0){
    displayTitles = episodeTitles
  } else if(episodeNumbers.length > 1 && seriesTitles.length == 1 && episodeTitles.length > 0){ 
    displayTitles = seriesTitles.concat( episodeTitles )
  } else {
    var alternativeTitles = titles.filter((titleNode) => titleNode.type == "Alternative").map((node) => node.text)

    if(alternativeTitles && alternativeTitles.length == titles.length){
      displayTitles = alternativeTitles.map((titleNode) => titleNode.text)
    } else {
      displayTitles = titles.map((node) => node.text)
    }
  }

  return displayTitles.join("; ")
}

function resultDescription(descriptions){
  if(descriptions.length > 0 && descriptions[0].text && descriptions[0].text.toLowerCase() !== "no description available"){
    return descriptions[0].text.substring(0, 500)
  } else {
    return ""
  }
}

function producingOrganization(creators){
  return creators ? creators.find(creator => creator.creatorRole?.[0] == "Producing Organization").creator : null 
}

export default function SearchResult({hit}){
  let guid = aapbGuid(hit.pbcoreDescriptionDocument)
  let description = resultDescription(hit.pbcoreDescriptionDocument.pbcoreDescription)
  let producingOrg = producingOrganization(hit.pbcoreDescriptionDocument.pbcoreCreator)

  return (
    <div className="search-result">
      <a href={`/search/${guid}`} >
        <pre>
          { "" || JSON.stringify(hit) }
        </pre>

        <div className="hit-thumbnail-container">
          <Thumbnail guid={ guid } />
        </div>      

        <div className="hit-info-container">

          <h3 className="hit-title">{ niceTitle(hit.pbcoreDescriptionDocument.pbcoreTitle) }</h3>

          <div>{ hit.pbcoreDescriptionDocument.pbcoreAssetDate ? hit.pbcoreDescriptionDocument.pbcoreAssetDate.text : " " }</div>
          
        </div>

        <div className="hit-producer">
          <b>Produced By:</b> { producingOrg }
        </div>
        <div className="hit-description">
          { description }
        </div>

        <div className="hit-score">
          <ScoreLight score={ hit._score } />
        </div>
      </a>
    </div>
  )
}