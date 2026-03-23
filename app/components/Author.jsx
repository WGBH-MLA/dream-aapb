export default function Author(props){
  return (
    <div className="author marbot marright">
      <div>
        <img src={ props.imgURL } />
      </div>
      <div>
          <h2>{ props.name }</h2>
          <span>{ props.bio }</span>
      </div>
    </div>
  )
}
