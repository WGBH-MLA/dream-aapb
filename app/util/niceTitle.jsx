export function niceTitle(titles){
  if(!titles || titles.length == 0){
    return `Untitled Record`
  }

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
