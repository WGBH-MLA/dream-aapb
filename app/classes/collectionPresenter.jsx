import { decode } from "html-entities"
import { useState } from 'react'
import { useNavigate } from "react-router"
import { renderBlocks, dangerousDiv } from "./contentHelpers"
import NiceItem from "../components/NiceItem"
import thumbnailURL from "../utils/thumbnailURL"
import LayoutSearch from "../components/LayoutSearch"

// import BabySearch from "../components/BabySearch"
//<BabySearch esIndex={ esConfig.esIndex } esURL={ esConfig.esURL } apiKey={ esConfig.apiKey } specialCollectionTag={ specialCollectionTag } />

export function renderCollection(collection, esConfig) {
  // console.log("rendering collection", collection)
  let specialCollectionTag = collection.tag || "peabody"

  let navigateHook = useNavigate()

  const [search, setSearch] = useState("")
  const [helpOpen, setHelpOpen] = useState(false)

  const handleCollectionSearch = (val) => {
    setSearch(val)
  }

  let niceItems, niceItemsContainer
  niceItems = collection.featured_items.map((item, i) => {
    return <NiceItem
      key={ i }
      title={item.value.title}
      guid={item.value.guids[0]}
      mediaType={ collection.featuredRecords[item.value.guids[0]]?.media_type }
      itemURL={ `/catalog/${item.value.guids[0]}` }
    />
  })

  if(niceItems.length > 0){
    niceItemsContainer = (
    <div className="collection-right">
      <div className="collection-section"></div>
      <h2 className="smarbot">Featured Items</h2>
        <div className="page-body marbot">
          {/* for baby <div className="items-search smarbot"></div>*/}
          <div className="nice-items-container marbot">
            <div className="nice-items-wrapper">
              { niceItems }
            </div>
          </div>
        </div>
      </div>
    )
  }
let viewCollectionURL = `/search?${esConfig.esIndex}[refinementList][special_collections][0]=${specialCollectionTag}`

let collectionSearch = (
  <div className="search-box-container">
    <LayoutSearch
      navigateHook={ navigateHook }
      esIndex={ esConfig.esIndex }
      handleChange={ handleCollectionSearch }
      searchQuery={ search }
      searchFilter={ `&${ esConfig.esIndex }[refinementList][special_collections][0]=${ specialCollectionTag }` }
      wide={ true }
      placeholder={ "Search the collection..." }
    />
    <div className="search-meta">
      <a href="/help-page" target="_blank" rel="noreferrer" className="help-link">
        Need Help Searching?
      </a>
      <a className="view-all-shadow" href={ viewCollectionURL }>
        View the collection
      </a>
    </div>
  </div>
)
let leftBlocks = (
  <div className="collection-resources">
    { renderBlocks(collection.content.filter(block =>
      ["resources"].includes(block.type)
    )) }
  </div>
)
  let rightBlocks = renderBlocks(collection.content.filter(block =>
    ["background"].includes(block.type)
  ))

return (
  <div className="page-container collection-page-container">
    <div className="collection-header">
      <h2>{ dangerousDiv(collection.title, false) }</h2>
    </div>
    <a className="top-back-link" href="/collections">&lt; Back To Special Collections</a>

    <div className="collection-main-grid">

      <div className="collection-left">
        <div className="collection-image-container">
          <img src={ collection.cover_medium.full_url } />
        </div>

        <div className="collection-section collection-search marbot">
          { collectionSearch }
        </div>

        <div className="collection-section">
          <div className="page-body">
            { leftBlocks }
          </div>
        </div>
      </div>

      <div className="collection-right">
        <div className="collection-section">
          <h2 className="smarbot">Collection Summary</h2>
          <div className="page-body">
            { dangerousDiv(collection.introduction) }
          </div>
          <hr />
        </div>

        <div className="collection-section">
          <div className="page-body">
            { rightBlocks }
          </div>
          <hr />
        </div>

        { niceItemsContainer }
      </div>

    </div>
  </div>
)
}