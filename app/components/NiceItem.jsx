import { decode } from "html-entities"
import Thumbnail from "../components/Thumbnail"

export default function NiceItem(props){
  // props.classes => pass in an array of strings to add css classes

  let thumbnail
  if(props.imgURL){
    thumbnail = <Thumbnail url={ props.imgURL } />
  } else {
    thumbnail = <Thumbnail guid={ props.guid } mediaType={ props.mediaType } />
  }

  let classes = "nice-item marbot"
   if(props.classes){
    classes += ` ${props.classes.join(" ")}`
  }

  return (
    <div className={ classes }>
      <a href={ props.itemURL } >
        { thumbnail }
        <h2 suppressHydrationWarning={true} dangerouslySetInnerHTML={{ __html: decode(props.title) }} />
      </a>
    </div>
  )  
}
