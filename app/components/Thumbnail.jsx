import { useState, useEffect } from 'react'

function hitThumbnail(guid){
  return `https://s3.us-east-1.amazonaws.com/americanarchive.org/thumbnail/${guid}.jpg`
}

export default function Thumbnail(props) {
  const [exists, setExists] = useState(false)
  var url = hitThumbnail(props.guid)
  var classes = props.searchResult ? "hit-thumbnail" : "show-thumbnail"

  var img
  if(exists){
    img = <img src={ url } />
  } else {
    img = <img src="/VIDEO.png" />
  }

  useEffect(() => {
    fetch(url, {method: "HEAD"}).then((resp) => setExists(resp.ok))
  })

  return (
    <div className={ classes }>
       {exists}
      { img }
    </div>
  )
}
