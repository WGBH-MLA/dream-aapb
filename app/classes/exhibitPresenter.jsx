import { decode } from "html-entities"
// import { renderSidebar, renderPageTitleBar } from "./pageHelpers"
import { renderBlocks } from "./contentHelpers"
import Author from "../components/Author"

export function renderExhibit(exhibit) {
  console.log("rendering exhibit", exhibit)
  let blocks = renderBlocks(exhibit.content)
  let authors = exhibit.authors.map( (author) => <Author name={ author.name } img_url={ author.img_url } bio={ author.bio } /> )

  return (
    <div>
      <div className="page-container">
        <div className="skinny-body-container title">
          <h2>
            { exhibit.title }
            <a href="/exhibits">Back To Exhibits</a>
          </h2>
        </div>

        <div className="skinny-body-container">
          <div className="page-body">
            { blocks }
          </div>
        </div>

        <div className="skinny-body-container">
          <div className="authors-container">
            { authors }
          </div>
        </div>
      </div>
    </div>
  )
}





