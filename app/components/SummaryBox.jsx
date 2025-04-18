export default function SummaryBox(props){
  return (
    <div className="summary-box-container">
      <h2>{ props.title }</h2>
      <div className="summary-box">
        { props.text }
      </div>
    </div>
  )
}
