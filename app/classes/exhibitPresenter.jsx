import { decode } from "html-entities"
import { useEffect } from "react"
import { renderBlocks } from "./contentHelpers"
import Author from "../components/Author"
import InvitingSidebar from "../components/InvitingSidebar"

export function renderExhibit(exhibit) {
  let blocks = renderBlocks(exhibit.body)

  let authorsBlock
  let authors = exhibit.authors.map((author, i) => (
    <Author key={i} name={author.name} imgURL={author.image.url} bio={author.bio} />
  ))
  if (authors.length > 0) {
    authorsBlock = (
      <div className="authors-container">
        <h2 className="smarbot">Authors</h2>
        { authors }
      </div>
    )
  }

  // find current section index for next link
  let currentIndex = exhibit.sections
    ? exhibit.sections.findIndex((s) => exhibit.meta.html_url.includes(s.url))
    : -1
  let nextSection = exhibit.sections && currentIndex >= 0 && currentIndex < exhibit.sections.length - 1
    ? exhibit.sections[currentIndex + 1]
    : null

  let sectionsBlock
  if (exhibit.sections && exhibit.sections.length > 0) {
    sectionsBlock = (
      <div className="exhibit-sections-box">
        <h3>Exhibit Sections</h3>
        <ul>
          {exhibit.sections.map((section, i) => (
            <li key={i}><a href={section.url}>{section.text}</a></li>
          ))}
        </ul>
      </div>
    )
  }

  let resourcesBlock
  if (exhibit.resources && exhibit.resources.length > 0) {
    resourcesBlock = (
      <div className="resources-container">
        <h2 className="smarbot">Resources</h2>
        <ul>
          {exhibit.resources.map((resource, i) => (
            <li key={i}><a href={resource.url}>{resource.text}</a></li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      <div className="page-container">
        <div className="exhibit-top-back-link-container">
          <a className="exhibit-top-back-link" href="/exhibits">&lt; Back To Exhibits</a>
          </div>
          <div className="sidey-body-container exhibit-title marbot">
            <div className="exhibit-top-slice-container"></div>
          <div className="exhibit-top-container">
            <h2>{ exhibit.title }</h2>
            <img src={ exhibit.cover_image.full_url } />
            </div>

        </div>

        { sectionsBlock }

        <div className="sidey-body-container">
          <div className="page-body">
            { blocks }
            { nextSection && (
              <div className="exhibit-next-link">
                <a href={nextSection.url}>Next: {nextSection.text} &gt;</a>
              </div>
            )}
          </div>
        </div>

        <div className="exhibit-bottom-row">
          { authorsBlock }{ resourcesBlock }
        </div>

      </div>
    </div>
  )
}