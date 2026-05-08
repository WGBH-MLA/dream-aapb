import { useState, useEffect } from "react"
import Thumbnail from "../components/Thumbnail"
import Captions from "../components/Captions"
import thumbnailURL from "../utils/thumbnailURL"
import addADButton from "../utils/addADButton"
import addSkipButtons from "../utils/addSkipButtons"
import { checkVisible } from "../utils/helpers"
import videojs from "video.js"
import "../styles/video-js.min.css"

export default function ClientVideoPlayer(props){
  const [pippy, setPippy] = useState(false)
  const [blockPippy, setBlockPippy] = useState(false)


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
        height: 480,
        controlBar: {
          // fake it!!
          pictureInPictureToggle: false
        }
      }, () => {
        // player is initialized

        videojs.log('I am ready for your video yes!')
        let player = videojs.players["vjs-player"]
        if(props.adHLSURL){
          

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

        // always add em, never dont
        addSkipButtons(videojs)

        window.addEventListener('scroll', () => {
          let mediaContainer = document.getElementById("show-media")
          if(!blockPippy){
            // we are allowed to pippy

            // this is the pippy we crave
            let pippyValue = !checkVisible(mediaContainer)

            if(pippyValue !== pippy){
              // but is it the pippy we deserve?

              setBlockPippy(true)
              // upon pippying we must restrain ourselves from pippying
              setTimeout(() => {
                console.log( 'repip!' )
                // lest we pippy too much
                setBlockPippy(false)
              }, 200)

              setPippy(pippyValue)
            }
          }
        })

        // this.on('ended', function() {
          // videojs.log('whoa mama!!')
        // });
      })  
    }
  })
  
  if(props.mediaURL){
    let playerClasses = "video-player-container"
    if(pippy){
      playerClasses += " mini"
    }
    return (
      <div id="video-player-container" className={ playerClasses }>
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
