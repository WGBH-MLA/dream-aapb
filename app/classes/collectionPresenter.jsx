import { decode } from "html-entities"
import { renderBlocks, dangerousDiv } from "./contentHelpers"
import NiceItem from "../components/NiceItem"
import thumbnailURL from "../utils/thumbnailURL"
import BabySearch from "../components/BabySearch"

//<BabySearch indexName={ esConfig.esIndex } esURL={ esConfig.esURL } apiKey={ esConfig.apiKey } specialCollectionTag={ specialCollectionTag } />


export function renderCollection(collection, esConfig) {
  console.log("rendering collection", collection)
  let specialCollectionTag = collection.tag || "peabody"
  
  let niceItems
  niceItems = collection.featured_items.map((item) => <NiceItem title={item.value.title} guid={item.value.guids[0]} mediaType={ collection.featuredRecords[item.value.guids[0]]?.media_type } itemURL={ `/search/${item.value.guids[0]}` } />)
  let blocks = renderBlocks(collection.content)
  return (
    <div>
      <div className="page-container">

        <div className="skinny-body-container collection-title smarbot">
          <div className="collection-image-container">
            <img src={ collection.hero_image.full_url } />
          </div>
          
          <div className="collection-title-container">
            <h2>{ dangerousDiv(collection.title, false) }</h2>
            <a className="top-back-link martop" href="/collections">&lt; Back To Collections</a>
          </div>
        </div>
  
        <div className="skinny-body-container">
          <h2 className="smarbot">Introduction</h2>
          <div className="page-body">
            { dangerousDiv(collection.introduction) }
          </div>
        </div>

        <div className="skinny-body-container">
          <div className="page-body">
            { blocks }
          </div>
        </div>

        <div className="skinny-body-container">
          <h2 className="smarbot">Featured Items</h2>
          <div className="page-body marbot">
            <div className="items-search smarbot">
              
            </div>
            
            <div className="nice-items-container marbot">
              <div className="nice-items-wrapper">
                { niceItems }
              </div>
            </div>
          </div>
        </div>
        <div className="skinny-body-container">
          <a className="back-link martop marbot" href="/collections">&lt; Back To Collections</a>
        </div>
      </div>
    </div>
  )
}
