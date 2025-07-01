export default function ShowBox(props){
  return (
    <div className="show-box">
      <label>{ props.label }</label>
      { props.text }
    </div>
  )
}