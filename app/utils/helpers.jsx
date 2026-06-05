export function niceTitle(titles){
  if(!titles || titles.length == 0){
    return `Untitled Record`
  }

  var displayTitles
  var seriesTitles = titles.filter((titleNode) => titleNode.titleType == "Series").map((node) => node.text)
  var episodeTitles = titles.filter((titleNode) => titleNode.titleType == "Episode").map((node) => node.text)
  var episodeNumbers = titles.filter((titleNode) => titleNode.titleType == "Episode Number").map((node) => node.text)

  if(seriesTitles.length > 1 && episodeNumbers.length > 0 && episodeTitles.length > 0){
    displayTitles = episodeTitles
  } else if(episodeNumbers.length > 1 && seriesTitles.length == 1 && episodeTitles.length > 0){ 
    displayTitles = seriesTitles.concat( episodeTitles )
  } else {
    var alternativeTitles = titles.filter((titleNode) => titleNode.titleType == "Alternative").map((node) => node.text)

    if(alternativeTitles && alternativeTitles.length == titles.length){
      displayTitles = alternativeTitles.map((titleNode) => titleNode.text)
    } else {
      displayTitles = titles.map((titleNode) => {
        if(titleNode.titleType != "Alternative"){
          return titleNode.text
        }
      })
    }
  }

  return displayTitles.join("; ")
}

export function dateTypeName(type){
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

export function secondsToHMS(seconds){
  return new Date(seconds * 1000).toISOString().slice(11, 19)
}

export function checkVisible(ele) {
  if(!ele){
    // element was missing somewhere during render cycle oopsie!!
    return false
  }

  var rect = ele.getBoundingClientRect()
  var viewHeight = Math.max(document.documentElement.clientHeight*0.7, window.innerHeight*0.7)
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
}

export function truth(val){
  // lmao who made this language
  return val || typeof val === "number" || typeof val === "string"
}


export function scrollToAnchorTranscript(anchorId) {
  var page = document.querySelector('body')
  var scrollable = document.getElementById('transcript-viewer')
  var scrolled = document.getElementById(anchorId)
  if(scrolled){
    page.scrollTop = scrollable.offsetTop-page.offsetTop
    // 24px to push it down off the top of viewer a little
    scrollable.scrollTop = scrolled.offsetTop-scrollable.offsetTop - 24
  }
}

export function scrollToAnchor(anchorId) {
  var page = document.querySelector('body')
  var scrolled = document.getElementById(anchorId)
  if(scrolled){

    page.scrollTop = scrolled.offsetTop-page.offsetTop
    // 24px to push it down off the top of viewer a little
  }
}

export function scrollToTop() {
  window.scrollTo(0, 0)
}
