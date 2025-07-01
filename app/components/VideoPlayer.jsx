import Thumbnail from "../components/Thumbnail"
import thumbnailURL from "../util/thumbnailURL"

export default function VideoPlayer(props){
  if(true || videoRetrieved){
    return (
      //poster={ thumbnailURL(props.guid) }
      <div className="video-player-container">
        <video controls preload="auto">
          <source src="/A_Colour_Box_512kb.mp4" />
        </video>
      </div>    
    )
  } else {
    return <Thumbnail guid={ props.guid } />
  }
}
