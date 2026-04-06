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

  return (

    <div className={ classes } >
      <div className="viewer-controls" onClick={ () => props.setShowContent(!props.showContent) }>
        { props.label }
        { chevy }
      </div>
      <div className="viewer-content">
        <pre>
          { props.content }
        </pre>
      </div>
    </div>
  )
}
