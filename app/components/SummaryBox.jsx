export default function SummaryBox(props){
  return (
    <div className="summary-box-container">
      <h2>{ props.title }</h2>
      <div class="summary-box">
        { props.text }
      </div>
    </div>
  )
}
