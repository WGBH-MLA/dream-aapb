import { useEffect } from "react"
import Thumbnail from "../components/Thumbnail"
import thumbnailURL from "../utils/thumbnailURL"
import videojs from "video.js"

export default function ClientVideoPlayer(props){
  if(!props.guid){ return null }

  var player
  useEffect(() => {
    player = videojs('vjs-player', {}, function onPlayerReady() {
      videojs.log('Your player is ready!')

      // In this context, `this` is the player that was created by Video.js.
      // this.play()

      // How about an event listener?
      // this.on('ended', function() {
        // videojs.log('whoa mama!!')
      // });
    })
  })
  

  if(props.mediaURL){
    return (
      <div className="video-player-container">
        <video id="vjs-player" poster={ thumbnailURL(props.guid) } controls preload="auto" width="640" height="480">
          <source src={ props.mediaURL || "/A_Colour_Box_512kb.mp4" } />
        </video>
      </div>
    )
  } else {
    return (
      <div className="martop marbot">
        <Thumbnail
          guid={ props.guid }
          mediaType={ props.mediaType }
          cmsPlayer={ props.cmsPlayer }
          babyTitle={ props.title }
        />
      </div>
    )
  }
}
