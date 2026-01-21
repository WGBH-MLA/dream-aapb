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

      <div className="skinny-body-container">
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

  let collectionSearch = (<LayoutSearch
      navigateHook={ navigateHook }
      esIndex={ esConfig.esIndex }
      handleChange={ handleCollectionSearch }
      searchQuery={ search }
      searchFilter={ `&${ esConfig.esIndex }[refinementList][special_collections][0]=${ specialCollectionTag }` }
      wide={ true }
      placeholder={ "Search within the collection..." }
    />)

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

        <div className="skinny-body-container collection-search marbot">
          { collectionSearch }
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

        { niceItemsContainer }

        <div className="skinny-body-container">
          <a className="back-link martop marbot" href="/collections">&lt; Back To Collections</a>
        </div>
      </div>
    </div>
  )
}
