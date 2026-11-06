import { useState } from "react"

export default function Accordion({ title, defaultOpen = false, className = "smarbot", children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={ `show-metadata-container ${className}` }>
      <div
        className="show-metadata-header show-accordion-toggle"
        role="button"
        tabIndex={ 0 }
        aria-expanded={ open }
        onClick={ () => setOpen(!open) }
        onKeyDown={ (e) => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); setOpen(!open) } } }
      >
        { open ? "\u25BE" : "\u25B8" } { title }
      </div>
      { open && <div className="show-accordion-body">{ children }</div> }
    </div>
  )
}