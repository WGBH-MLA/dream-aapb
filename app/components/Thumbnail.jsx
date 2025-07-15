import { useState, useEffect } from 'react'
import thumbnailURL from "../util/thumbnailURL"

import Record from "../util/Record"

export default function Thumbnail(props) {
  const [exists, setExists] = useState(false)
  var url = thumbnailURL(props.guid)
  var classes = props.searchResult ? "hit-thumbnail" : "show-thumbnail"

  var record = new Record(props.data)

  var img, bottomBar
  if(exists){
    img = <img crossOrigin="anonymous" className="thumbnail" src={ url } />
    bottomBar = <img src="/video-slice.png" className="thumbnail-bar" />
  } else {
    if(record.isVideo()){
      img = <img src="/VIDEO.png" className="thumbnail" />
    } else if(record.isAudio()) {
      img = <img src="/AUDIO.png" className="thumbnail" />
    }
  }

  useEffect(() => {
    fetch(url, {method: "HEAD", headers: {"Referer": "http://18.235.155.36:4000"}}).then((resp) => setExists(resp.ok)).catch((err) => setExists(null))
  })

  return (
    <div className={ classes }>
      { img }
      { bottomBar }
    </div>
  )
}
