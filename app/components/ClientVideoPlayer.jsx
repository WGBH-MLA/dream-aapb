import { useEffect } from "react"
import Thumbnail from "../components/Thumbnail"
import Captions from "../components/Captions"
import thumbnailURL from "../utils/thumbnailURL"
import addADButton from "../utils/addADButton"
import videojs from "video.js"
import "../styles/video-js.min.css"

export default function ClientVideoPlayer(props){
  if(!props.guid){
    return null
  }

  var captions
  if(props.captionURL){
    // we received a caption url
    captions = <Captions src={ props.captionURL } />
  }

  useEffect(() => {
    if(props.mediaURL){
      videojs('vjs-player', {
        fluid: true,
        width: 640,
        height: 480
      }, () => {
        // player is initialized

        videojs.log('I am ready for your video yes!')

        if(props.adHLSURL){
          let player = videojs.players["vjs-player"]

          // we received an audio desc URL
          addADButton(videojs, props.adHLSURL)

          const controlBar = player.getChild("controlBar")
          if ( !controlBar.getChild("ADMenuButton") ) {
            const children = controlBar.children()
            const captionsIndex = children.findIndex(c => c.name() === "SubsCapsButton")
            const insertIndex = captionsIndex !== -1 ? captionsIndex + 1 : children.length
            controlBar.addChild("ADMenuButton", {}, insertIndex)
          }
        }

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
          { captions }
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
