import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function SearchAccordion(props){
  const [isOpen, setIsOpen] = useState(!props.startClosed)

  let classes = "search-accordion-content"
  if(isOpen){
    classes = classes + " open"
  }

  let chevy
  if(isOpen){
    chevy = <ChevronDown />
  } else {
    chevy = <ChevronUp />
  }

  return (
    <div className="search-accordion-container">
      <div onClick={ () => { setIsOpen( !isOpen ) } } className="search-accordion-toggle">
        <h4 className="search-accordion-title">
          { props.title }{ chevy }
        </h4>
      </div>
      <div className={ classes } >
        { props.content }
      </div>
    </div>
  )
}
