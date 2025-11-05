export default function Author(props){
  return (
    <div className="author marbot">
      <img src={ props.img_url } />
      <h2>{ props.name }</h2>
      <span>{ props.bio }</span>
    </div>
  )
}
