export default function ViewSelect(props){
  let classes = "view-select-button"
  if(props.selected){
    classes += " selected"
  }
  return (
    <div className={ classes } onClick={ () => props.viewSelect( props.viewType ) } >
      <img src={ `/${props.viewType}-icon.png` } />
    </div>
  )
}