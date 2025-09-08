import { useState, useEffect } from 'react'
import thumbnailURL from "../util/thumbnailURL"

export default function Thumbnail(props) {
  var img, bottomBar
  if(props.url){
    img = <img src={ props.url } />
  } else {
    const [exists, setExists] = useState(false)
    var url = thumbnailURL(props.guid)
    var classes = props.searchResult ? "hit-thumbnail" : "show-thumbnail"

    if(exists){
      img = <img crossOrigin="anonymous" className="thumbnail" src={ url } />
      bottomBar = <img src="/video-slice.png" className="thumbnail-bar" />
    } else {
      if(props.mediaType == "Moving Image"){
        img = <img src="/VIDEO.png" className="thumbnail" />
      } else if(props.mediaType == "Sound") {
        img = <img src="/AUDIO.png" className="thumbnail" />
      } else {
        img = <img src="/NONE.png" className="thumbnail" />
      }
    }

    useEffect(() => {
      // todo need to get the hostname into here, but with Hits -> hitComponent pattern not clear how to bring in addl props
      var hostname = "http://18.235.155.36:4000"
      hostname = "http://localhost:4000"
      fetch(url, {method: "HEAD", headers: {"Referer": hostname}}).then((resp) => setExists(resp.ok)).catch((err) => setExists(null))
    })
  }

  return (
    <div className={ classes }>
      { img }
      { bottomBar }
    </div>
  )
}
