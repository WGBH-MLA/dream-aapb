import Thumbnail from "../components/Thumbnail"
import thumbnailURL from "../utils/thumbnailURL"

export default function VideoPlayer(props){
  if(!props.guid){ return null }

  if(props.mediaURL){
    return (
      <div className="video-player-container">
        <video poster={ thumbnailURL(props.guid) } controls preload="auto" width="640" height="480">
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
