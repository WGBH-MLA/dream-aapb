import { ChevronDown, ChevronRight } from 'lucide-react'
export default function Viewer(props){
  let classes = "show-metadata-container bmarbot viewer"
  if(props.showContent){
    classes += " show"
  }

  let chevy
  if(props.showContent){
    chevy = <ChevronDown />
  } else {
    chevy = <ChevronRight />
  }

  let toggler = <b onClick={ () => props.setShowContent(!props.showContent) }>(Click to toggle full PBCore view){ chevy }</b>
  return (

    <div className={ classes } >
      <div className="viewer-controls">
        { props.label }
        { toggler }
      </div>
      <div className="viewer-content">
        <pre>
          { props.content }
        </pre>
      </div>
    </div>
  )
}
