import Thumbnail from "../components/Thumbnail"

export default function NiceItem(props){

  let thumbnail
  if(props.imgURL){
    thumbnail = <Thumbnail url={ props.imgURL } />
  } else {
    thumbnail = <Thumbnail guid={ props.guid } mediaType={ props.mediaType } />
  }

  return (
    <div className="nice-item marbot">
      <a href={ props.itemURL } >
        { thumbnail }
        <h2>{props.title}</h2>
      </a>
    </div>
  )  
}
