export default function NiceItem(props){
  return (
    <div className="nice-item">
      <a href={ props.item_url } >
        <img src={props.img_url} />
        <h2>{props.title}</h2>
      </a>
    </div>
  )  
}

