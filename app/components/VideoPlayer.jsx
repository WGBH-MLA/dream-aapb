import Thumbnail from "../components/Thumbnail"
import thumbnailURL from "../util/thumbnailURL"

export default function VideoPlayer(props){
  if(true || videoRetrieved){
    return (
      <div className="video-player-container">
        <video poster={ thumbnailURL(props.guid) } controls preload="auto">
          <source src="/A_Colour_Box_512kb.mp4" />
        </video>
      </div>    
    )
  } else {
    return <Thumbnail guid={ props.guid } />
  }
}
