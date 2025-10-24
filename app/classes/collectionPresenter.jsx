import { decode } from "html-entities"
// import { renderSidebar, renderPageTitleBar } from "./pageHelpers"
import { dangerousDiv } from "./contentHelpers"
import NiceItem from "../components/NiceItem"
import BabySearch from "../components/BabySearch"

export function renderCollection(collection, esConfig) {
  console.log("rendering collection", collection)
  // let blocks = renderBlocks(collection.content)
  let specialCollectionTag = collection.tag

  let niceItems = collection.featured_items.map((item) => <NiceItem title={item.title} img_url={item.img_url} item_url={item.item_url} />)
  return (
    <div>
      <div className="page-container">

        <div className="skinny-body-container title">

          <div className="collection-image-container">
            <img src={ collection.thumbnail.url } />
          </div>
          
          <div className="collection-title-container">
            <h2>{ dangerousDiv(collection.title) }</h2>
            <h2>
              <a href="/collections">Back To Collections</a>
            </h2>
          </div>
        </div>
  
        <div className="skinny-body-container">
 
        </div>

        <div className="skinny-body-container">
          <h2 className="smarbot">Summary</h2>
          <div className="page-body">
            { dangerousDiv(collection.summary) }
          </div>
        </div>

        <div className="skinny-body-container">
          <h2 className="smarbot">Featured Items</h2>
          <div className="page-body marbot">
            <div className="items-search smarbot">
              <BabySearch indexName={ esConfig.indexName } esURL={ esConfig.esURL } apiKey={ esConfig.apiKey } specialCollectionTag={ specialCollectionTag } />
            </div>
            
            <div>
              { niceItems }
            </div>
          </div>
        </div>

        <div className="skinny-body-container">
          <h2 className="smarbot">Background</h2>
          <div className="page-body">
            { dangerousDiv(collection.background) }
          </div>
        </div>

        <div className="skinny-body-container">
          <h2 className="smarbot">Resources</h2>
          <div className="page-body">
            { dangerousDiv(collection.resources) }
          </div>
        </div>
        
        <div className="skinny-body-container">
          <div className="collection-title-container">
            <h2>{ dangerousDiv(collection.title) }</h2>
            <h2>
              <a href="/collections">Back To Collections</a>
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}





