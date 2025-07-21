export default function PullQuote(props){
  
  return (
    <div className="pull-quote-container">
      <div className="pull-quote-text">
        { props.text }
      </div>
      <div className="pull-quote-attribution">
        { props.attribution }
      </div>
    </div>
  )
}
