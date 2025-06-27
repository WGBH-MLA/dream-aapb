export default function HeaderBar(props){
  return (
    <div className="show-header-bar">
      <div className="show-title">
        <h2>{ props.title }</h2>
        <hr />
      </div>
    </div>
  )
}
