import { decode } from 'html-entities'
// import { renderSidebar, renderPageTitleBar } from './pageHelpers'
import { renderBlocks } from './contentHelpers'

export function renderExhibit(exhibit) {
  console.log('rendering exhibit', exhibit)
  let blocks = renderBlocks(exhibit.content)

  return (
    <div>
      <div className='page-container'>
        <div className="skinny-body-container">
          <h2>
            { exhibit.title }
            <a href="/exhibits">Back To Exhibits</a>
          </h2>
        </div>

        <div className='skinny-body-container'>
          <div className='page-body'>
            { blocks }
          </div>
        </div>
      </div>
    </div>
  )
}





