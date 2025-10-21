import { decode } from 'html-entities'
// import { renderSidebar, renderPageTitleBar } from './pageHelpers'
import { renderBlocks } from './contentHelpers'

export function renderCollection(collection) {
  console.log('rendering collection', collection)
  let blocks = renderBlocks(collection.content)

  return (
    <div>
      <div className='page-container'>
        <div className="skinny-body-container">
          <h2>
            { collection.title }
            <a href="/collections">Back To Collections</a>
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





