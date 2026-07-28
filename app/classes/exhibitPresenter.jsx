import { decode } from "html-entities"
import { useEffect, useRef, useState } from "react"
import { renderBlocks } from "./contentHelpers"
import Author from "../components/Author"

export function renderExhibit(exhibit) {
  let blocks = renderBlocks(exhibit.body)

  let authorsBlock
  let authors = exhibit.authors.map( (author, i) => <Author key={i} name={ author.name } imgURL={ author.image.url } bio={ author.bio } /> )
  if(authors.length > 0){
    authorsBlock = (
      <>
        <h2 className="smarbot">Curators</h2>
        <div className="authors-container">
          { authors }
        </div>
      </>
    )
  }

  return (
    <div>
      <div className="page-container">

        <ExploreExhibitDropdown links={ exhibit.sections } />

        <div className="sidey-container">
          <div className="sidey-body marleft">
            <div className="sidey-body-container exhibit-title marbot">
              <h1 suppressHydrationWarning={true} dangerouslySetInnerHTML={{ __html: decode(exhibit.title) }} />
              <ExhibitBreadcrumbs exhibit={ exhibit } />
            </div>

            <div className="sidey-body-container">
              <div className="page-body">
                { blocks }
              </div>
            </div>

            { authorsBlock && (
              <div className="sidey-body-container">
                { authorsBlock }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ExhibitBreadcrumbs({ exhibit }) {
  const parent = exhibit.meta.parent
  const isSubsection = parent && parent.title !== "AAPB"

  const topTitle = isSubsection ? parent.title : exhibit.title
  const topURL = isSubsection
    ? parent.meta.html_url.replace("http://aapb/", "/exhibits/")
    : exhibit.meta.html_url.replace("http://aapb/", "/exhibits/")

  return (
    <nav className="exhibit-breadcrumbs" aria-label="breadcrumb">
      <a href="/exhibits">All Exhibits</a>
      <span className="exhibit-breadcrumb-sep"> / </span>

      {isSubsection ? (
        <>
          <a href={ topURL }>{ topTitle }</a>
          <span className="exhibit-breadcrumb-sep"> / </span>
          <span className="exhibit-breadcrumb-current">{ exhibit.title }</span>
        </>
      ) : (
        <span className="exhibit-breadcrumb-current">{ topTitle }</span>
      )}
    </nav>
  )
}

function ExploreExhibitDropdown({ links }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="explore-exhibit-dropdown" ref={wrapperRef}>
      <button
        type="button"
        className="explore-exhibit-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        Explore the Exhibit <span className="explore-exhibit-caret">{ open ? '▼' : '▼' }</span>
      </button>

      {open && (
        <div className="explore-exhibit-menu">
          {links.map((section, i) => (
            <div key={i} className="page-sidebar-link">
              <a href={section.url}>{section.text}</a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}