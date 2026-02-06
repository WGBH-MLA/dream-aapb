import { decode } from "html-entities"

export default function SummaryBox(props){
  let title
  if(props.title && props.title.length > 0){
    title = <h2>{ props.title }</h2>
  }
  return (
    <div className="summary-box-container">
      { title }
      <div className="summary-box" dangerouslySetInnerHTML={{ __html: decode(props.text) }} />
    </div>
  )
}
