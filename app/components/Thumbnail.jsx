import { useState, useEffect } from 'react'
import thumbnailURL from "../utils/thumbnailURL"
import { getRecord } from "../utils/getRecord"

// exists
const UNKNOWN = -2
const CHECKING = -1
const NOTEXIST = 0
const EXIST = 1

export default function Thumbnail(props) {
  var img, bottomBar
  if(props.url){
    // it exists, or so you claim..................
    img = <img src={ props.url } />
  } else {

    // const [completedCheck, setCompletedCheck] = useState(UNCHECKED)
    const [exists, setExists] = useState(UNKNOWN)
    var url = thumbnailURL(props.guid)

    var classes
    if(props.searchResult){
      classes = "hit-thumbnail"
    } else if(props.cmsPlayer){
      classes = "cms-thumbnail"
    } else {
      classes = "show-thumbnail"
    }

    if(exists === EXIST){
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

      // dont run in ssr
      if (typeof window !== "undefined") {
        if(exists === UNKNOWN){
          let ele = document.getElementById(props.guid)
          if( checkVisible(ele) ){
            fetch(url, {method: "HEAD"}).then((resp) => {
              setExists(resp.ok ? EXIST : NOTEXIST)
              // setCompletedCheck(CHECKED)
            }).catch((err) => {
              setExists(NOTEXIST)
              // setCompletedCheck(CHECKED)
            })
          }
          setExists(CHECKING)
          // setCompletedCheck(WAITING)

          window.addEventListener('scrollend', function () {

            if(exists === UNKNOWN){
              let ele = document.getElementById(props.guid)
              if( checkVisible(ele) ){
                fetch(url, {method: "HEAD"}).then((resp) => {
                  setExists(resp.ok ? EXIST : NOTEXIST)
                  // setCompletedCheck(CHECKED)
                }).catch((err) => {
                  setExists(NOTEXIST)
                  // setCompletedCheck(CHECKED)
                })

                setExists(CHECKING)
              }
            }
           
          })
        }
       
        
      }
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
