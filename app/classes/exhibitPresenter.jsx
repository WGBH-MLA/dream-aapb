import { decode } from "html-entities"
import { useEffect } from 'react'
// import { renderSidebar, renderPageTitleBar } from "./pageHelpers"
import { renderBlocks } from "./contentHelpers"
import Author from "../components/Author"

export function renderExhibit(exhibit) {
  let blocks = renderBlocks(exhibit.body)

  let authorsBlock
  let authors = exhibit.authors.map( (author, i) => <Author key={i} name={ author.name } imgURL={ author.image.url } bio={ author.bio } /> )
  if(authors.length > 0){
    authorsBlock = (
      <>
        <h2 className="smarbot">Authors</h2>
        <div className="authors-container">
          { authors }
        </div>
      </>
    )
  }

  useEffect(() => {
    fixLinks()
  }, [])

  return (
    <div>
      <div className="page-container">
        <div className="skinny-body-container exhibit-title marbot bmarright">
          <h2>
            { exhibit.title }
          </h2>
          <div>
            <a className="exhibit-top-back-link" href="/exhibits">&lt; Back To Exhibits</a>
          </div>
        </div>

        <div className="skinny-body-container">
          <div className="page-body">
            { blocks }
          </div>
        </div>

        <div className="skinny-body-container">
          { authorsBlock }
        </div>
      </div>
    </div>
  )
}

function fixLinks(){
  var links = document.querySelectorAll('a')
  links.forEach((link) => {
    if(link.pathname.startsWith("/exhibits/")){
      console.log( 'before', link.pathname )
      link.pathname = link.pathname.replace(/.md$/, '').replace(/^\/exhibits\/.*\//, '/exhibits/')
      console.log( 'linkkkkkk', link.pathname, link.href )
    }
  })

}