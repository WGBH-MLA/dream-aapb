import { useEffect } from "react"
import Thumbnail from "../components/Thumbnail"
import thumbnailURL from "../utils/thumbnailURL"
import videojs from "video.js"
import "../styles/video-js.min.css"

export default function ClientVideoPlayer(props){
  if(!props.guid){ return null }

  var player
  useEffect(() => {
    if(props.mediaURL){
      player = videojs('vjs-player', {}, function onPlayerReady() {
        videojs.log('I am ready for your video yes!')

        // In this context, `this` is the player that was created by Video.js.
        // this.play()

        // How about an event listener?
        // this.on('ended', function() {
          // videojs.log('whoa mama!!')
        // });
      })  
    }
  })
  

  if(props.mediaURL){
    return (
      <div className="video-player-container">
        <video className="video-js" id="vjs-player" poster={ thumbnailURL(props.guid) } controls preload="auto" width="640" height="480">
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
        />
      </div>
    )
  }
}
