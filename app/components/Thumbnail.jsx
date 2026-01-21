import { useState, useEffect } from 'react'
import thumbnailURL from "../utils/thumbnailURL"
import { getRecord } from "../utils/getRecord"

export default function Thumbnail(props) {
  var img, bottomBar
  if(props.url){
    // it exists, or so you claim..................
    img = <img src={ props.url } />
  } else {

    const [completedCheck, setCompletedCheck] = useState(false)
    const [exists, setExists] = useState(false)
    var url = thumbnailURL(props.guid)

    var classes
    if(props.searchResult){
      classes = "hit-thumbnail"
    } else if(props.cmsPlayer){
      classes = "cms-thumbnail"
    } else {
      classes = "show-thumbnail"
    }

    if(exists){
      img = <img id={ props.guid } crossOrigin="anonymous" className="thumbnail" src={ url } />
      bottomBar = <img id={ props.guid } src="/video-slice.png" className="thumbnail-bar" />
    } else {
      if(props.mediaType == "Moving Image"){
        img = <img id={ props.guid } src="/VIDEO.png" className="thumbnail" />
      } else if(props.mediaType == "Sound") {
        img = <img id={ props.guid } src="/AUDIO.png" className="thumbnail" />
      } else {
        img = <img id={ props.guid } src="/NONE.png" className="thumbnail" />
      }
    }

    useEffect(() => {
      window.addEventListener('scroll', function () {
        
        // check if thumbnail exists, when appropriate
        let ele = document.getElementById(props.guid)
        if(!completedCheck){

          if( checkVisible(ele) ){
              fetch(url, {method: "HEAD"}).then((resp) => {
                setExists(resp.ok)
              }).catch((err) => {
                setExists(null)
              })

            // ultimately only check once, when the img elemetn is visible
            setCompletedCheck(true)
          }
        }
      })
    }, [])
  }

  let babyTitle
  if(props.babyTitle){
    babyTitle = <div className="baby-title">{ props.babyTitle }</div>
  }

  return (
    <div className={ classes }>
      { img }
      { bottomBar }
      { babyTitle }
    </div>
  )
}

function checkVisible(ele) {
  if(!ele){
    // element was missing somewhere during render cycle oopsie!!
    return false
  }
  
  var rect = ele.getBoundingClientRect()
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
}
