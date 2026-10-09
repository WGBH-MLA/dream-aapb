import { encode } from "html-entities"
import { useState, useEffect, useRef } from 'react'
import { useLoaderData, useSearchParams } from 'react-router'
import Searchkit from "searchkit"
import Client from '@searchkit/instantsearch-client'
import { ChevronDown, LayoutPanelLeft } from 'lucide-react'

import { getCollections } from "../utils/fetch"
import { scrollToTop }  from "../utils/helpers"
import originalSearch from "../searches/originalSearch"
import multimatchSearch from "../searches/multimatchSearch"
import dismaxSearch from "../searches/dismaxSearch"
import poshSearch from "../searches/poshSearch"
import boostySearch from "../searches/boostySearch"

import { SearchSubsets } from "../utils/SearchSubsets"
import { SearchModes } from "../utils/SearchModes"

import {
          InstantSearch,
          SearchBox,
          Hits,
          RefinementList,
          CurrentRefinements,
          ClearRefinements,
          ToggleRefinement,
          Pagination,
          HitsPerPage,
          // Stats,
          useStats,
          SortBy,
          useSearchBox,
          useInstantSearch,
      } from 'react-instantsearch';

import SearchResult from "../components/SearchResult"
import ListResult from "../components/ListResult"
import GalleryResult from "../components/GalleryResult"
import SearchAccordion from "../components/SearchAccordion"
import ViewSelect from "../components/ViewSelect"

export const loader = async ({params, request}) => {
  let collections = await getCollections("limit=999")

  return {
    esIndex: process.env.ES_INDEX,
    tsIndex: process.env.ES_TS_INDEX,
    apiKey: process.env.ES_API_KEY,
    esURL: process.env.ES_URL,
    collections: collections
  }
}

// aapb-freezing-osmium,transcript-freezing-osmium

function CustomStats(props) {
  function showCount(count){
    if(props.query){
      if(count && count > 0){
        return `${count} results found`
      } else if(count == 0){
        return "0 results found"
      }  
    }

    // no query, no text
    return ""
  }

  // const {
  //   hitsPerPage,
  //   nbHits,
  //   areHitsSorted,
  //   nbSortedHits,
  //   nbPages,
  //   page,
  //   processingTimeMS,
  //   query,
  // } = useStats()

  // return (
  //   <div className="ais-Stats">
  //     <span className="ais-Stats-text">
  //       Found {nbHits === 10000 ? "more than 10000" : nbHits} records in {processingTimeMS} ms
  //     </span>
  //   </div>
  // )

  return (
    <div className="ais-Stats">
      <span className="ais-Stats-text">
        { showCount(props.count) }
      </span>
    </div>
  )

}

function CustomSearchBox(props) {
  const { status } = useInstantSearch()
  const { _query, refine } = useSearchBox()

  const inputRef = useRef(null)
  const isSearchStalled = status === "stalled";

  return (
    <>
      <div className="">
        <h4>Search for</h4>
        <input
          id="query"
          className="sidebar-search"
          ref={inputRef}
          defaultValue={ props.query }
          onKeyUp={(e) => {
            props.handleCustomQuery(e.target.id, e.target.value, refine)
          }}
        />

        <h4>Contains all of these words</h4>
        <input id="all"  className="sidebar-search" type="text" onKeyUp={ (e) => props.handleCustomQuery(e.target.id, e.target.value, refine) } placeholder={ props.customQuery.all } />
        <h4>This title</h4>
        <input id="title"  className="sidebar-search" type="text" onKeyUp={ (e) => props.handleCustomQuery(e.target.id, e.target.value, refine) } placeholder={ props.customQuery.title } />
        <h4>None of these words</h4>
        <input id="none"  className="sidebar-search" type="text" onKeyUp={ (e) => props.handleCustomQuery(e.target.id, e.target.value, refine) } placeholder={ props.customQuery.none } />
        <div>
          <button className="sidebar-search-button">Update</button>
          <button id="copy" className="sidebar-search-button secondary smarleft" onClick={ props.copySearch }>Copy Search</button>
        </div>
        <div hidden={!isSearchStalled}>Searching…</div>

      </div>
    </>
  )  
}

export default function Catalog() {
  const data = useLoaderData()

  // include transcript in search or not
  const [searchSet, setSearchSet] = useState(SearchSubsets.BOTH)
  // which querying style are we using
  const [searchMode, setSearchMode] = useState(SearchModes.BOOSTY)
  const [count, setCount] = useState(null)
  
  // state that we need out here, and down inside the search area...
  const [searchParams, setSearchParams] = useSearchParams()
  const [customQuery, setCustomQuery] = useState({
    query: searchParams.get(`${ indicesToUse(searchSet, data.esIndex, data.tsIndex) }[query]`) || "",
    all: searchParams.get("all") || "",
    title: searchParams.get("title") || "",
    none: searchParams.get("none") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  })

  // store actual index names in state so it changes with the radio button
  const [currentIndexes, setCurrentIndexes] = useState( indicesToUse(searchSet, data.esIndex, data.tsIndex) )

  let view = searchParams.get("view") || "standard"
  const [viewSelect, setViewSelect] = useState(view)

  // config viewed refinements
  const [showingRefinements, setShowingRefinements] = useState(false)
  
  // toggle searchy UI on mobile only
  const [hideSearchy, setHideSearchy] = useState(false)
  const [searchyPosition, setSearchyPosition] = useState(0)

  const addToolTip = () => {
    document.getElementById("copy").innerHTML = "Copy Search<span class='tooltip fade'>Copied to clipboard</span>"
  }

  const copySearch = (indices) => {
    let query,all,title,none
    query = all = title = none = ""
    if(customQuery.query){
      query = `${ indices }[query]=${customQuery.query}`
    }

    if(customQuery.all){
      all = `&all=${customQuery.all}`
    }

    if(customQuery.title){
      title = `&title=${customQuery.title}`
    }

    if(customQuery.none){
      none = `&none=${customQuery.none}`
    }

    let url = `${window.location.href.split('?')[0]}/?${query}${all}${title}${none}`
    function copyTextToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Impressively succeeded copying to clipboard!');
        })
        .catch(err => {
          console.error('Annoyingly failed to copy text: ', err);
        })
    }

    copyTextToClipboard(url)
    addToolTip()
  }

  let sidebarClasses = "page-sidebar bmarleft"
  let topRefinementsBarClasses = "top-refinements-bar smarbot bmarleft"
  let mobileSidebarToggler = <LayoutPanelLeft />
  let toggleMessage
  if(hideSearchy){
    toggleMessage = "Show"
  } else {
    sidebarClasses += " open"
    topRefinementsBarClasses += " open"
    toggleMessage = "Hide"
  }

  function indicesToUse(search_set, asset_index, transcript_index){
    if(search_set === SearchSubsets.RECORD){
      // console.log( "RECORD" )
      return asset_index
    } else if(search_set === SearchSubsets.TRANSCRIPT){
      // console.log( "TRANSCRIPT" )
      return transcript_index
    } else {
      // console.log( "BOPH" )
      return `${asset_index},${transcript_index}`
    }
  }

  function handleSearchSet(search_set, asset_index, transcript_index){
    setSearchSet(search_set)
    setCurrentIndexes( indicesToUse(search_set, asset_index, transcript_index) )
  }

  function handleCustomQuery(type, value, refine){
    // ohh la la
    setCustomQuery({...customQuery, [type]: value})
    // console.log( 'the current complete value of customQuery is ', customQuery )
    let allParam = searchParams.get("all")
    if(customQuery.all && !allParam){
      searchParams.set("all", customQuery.all)
    }
    let titleParam = searchParams.get("title")
    if(customQuery.title && !titleParam){
      searchParams.set("title", customQuery.title)
    }
    let noneParam = searchParams.get("none")
    if(customQuery.none && !noneParam){
      searchParams.set("none", customQuery.none)
    }

    // make sure the query param changes (harmlessly) when there's no query present, so other boxes actually work onchange
    refine(customQuery.query === "" ? " " : customQuery.query)
  }

  function handleDateQuery(type, value){
    setCustomQuery({...customQuery, [type]: value})
  }

  const dateToYear = (items) => {
    return items.map((item) => {
      if(item.value){
        var notYear = item.value.match(/^\d{4}(.*)/)[1]
        item.value = item.value.replace( notYear, "")
        item.label = item.label.replace( notYear, "")
      }
      
      return item
    })
  }

  // const accessLevel = (items) => {
  //   // causes weird rerender and doesnt consolidate options as desired
  //   return items.map( (item) => {
  //     if(item.label == "Online Reading Room"){
  //       item.label = "Available Online"
  //     } else if(item.label == "On Location" || item.label == "On location"){
  //       item.label = "All Digitized"
  //     } else if(item.label == "Private"){
  //       item.label = "Private"
  //     } else {
  //       // private or nothing
  //       console.log( 'help!', item.label, item.value )
  //       item.label = "All Records"
  //     }

  //     return item
  //   }).sort((a,b) => {
  //     // sort availabilty options a-z so they dont jump around ui based on num results
  //     if(a < b){
  //       return 1
  //     } else {
  //       return -1
  //     }
  //   }).flat()
  // }

  const prettyFieldNames = (fieldName) => {
    switch(fieldName){
      case "producing_org":
        return "Producing Organization"
        break
      case "contributing_orgs":
        return "Contributing Organization"
        break        
      case "media_type":
        return "Media Type"
        break
      case "access_level":
        return "Availability"
        break
      case "genres":
        return "Genre"
        break
      case "topics":
        return "Topic"
        break        
      case "pbcoreDescriptionDocument.pbcoreAssetType.text":
        return "Asset Type"
        break
      case "special_collections":
        return "Collection"
        break
      case "series_titles":
        return "Series Title"
        break
      case "people":
        return "People"
        break
      case "contributors":
        return "Contributors"
        break
      default:
        return "Unmapped Facet"
    }
  }

  const prettyCurrentRefinements = (attributes) => {
    attributes.map((attribute) => {

      let refs = attribute.refinements.map((ref) => {
        // label is the actual facet field value which seems slightly weird
        ref.key = `${ref.label}-${Math.random().toString(36).slice(2)}`
        ref.label = `${ prettyFieldNames(attribute.label) }: ${ref.label}`
        return ref
      })

      // name of field (dont show in top bar)
      attribute.label = ""
      attribute.refinements = refs
      return attribute
    })

    return attributes
  }

// 10 attributea
// each one a facetcollection
// each fcollection has count, value, label

  const prettyCollections = (attributes) => {
    // console.log( 'ummm', attributes )

    attributes = attributes.map((attribute) => {
      // console.log( 'attribute', attribute )
      // console.log( 'honking', data.collections.forEach((honk) => console.log( 'honk!!', honk.meta.slug )) )
      let thisCollection = data.collections.find((coll) => coll.meta.slug == attribute.label )
      if(thisCollection){
        attribute.label = thisCollection.meta.slug
      }

      return attribute
    })

    return attributes
  }

  const onlyUnique = (value, index, array) => {
    return array.indexOf(value) === index
  }

  // createquotyquyery???

  let currentRefinementsClasses, showRefinementButtonText
  if(!showingRefinements){
    currentRefinementsClasses = "current-refinements-container closed"
    showRefinementButtonText = "Show Filters"
  } else {
    currentRefinementsClasses = "current-refinements-container"
    showRefinementButtonText = "Hide Filters"
  }


  let searchResultComponent
  if(viewSelect == "standard"){
    searchResultComponent = SearchResult
  } else if(viewSelect == "list"){
    searchResultComponent = ListResult
  } else if(viewSelect == "gallery"){
    searchResultComponent = GalleryResult
  }

  let pagination
  pagination = <Pagination />

  let searchbox
  searchbox = <CustomSearchBox
              handleCustomQuery={ handleCustomQuery }
              query={ customQuery.query }
              defaultQuery={ customQuery.query }
              customQuery={ customQuery }
              copySearch={ () => copySearch(indicesToUse(searchSet, data.esIndex, data.tsIndex), ) }
            />
  //////////



  const config = {
    connection: {
      host: data.esURL,
      apiKey: data.apiKey
    },
    search_settings: {
      // runtime_mappings: {
      //   asset: {
      //     type: "lookup",
      //     target_index: data.esIndex,
      //     input_field: "guid",
      //     target_field: "guid",
      //     // cant get nested fields in runtime lookuip
      //     fetch_fields: ["title", "producing_org", "media_type"]
      //   },

      // },

      // highlight_attributes: ["pbcoreDescriptionDocument.pbcoreTitle.text"],

      search_attributes: [
        // "guid",
        // "genres"
        // "pbcoreDescriptionDocument.pbcoreDescription",
        // "pbcoreDescriptionDocument.pbcoreTitle.text",
        // { field: "pbcoreDescriptionDocument.pbcoreTitle.text", weight: 5 },
        // { field: "pbcoreDescriptionDocument.pbcoreCreator", weight: 2 }
        // "pbcoreDescriptionDocument.pbcoreAnnotation.first.text",
        // "pbcoreDescriptionDocument.pbcoreIdentifier",
        
      ],

      // WHAT FIELDS ARE INCLUDED IN RETURNED HIT
      result_attributes: [
        "guid",
        "title",
        "broadcast_date",
        "pbcoreDescriptionDocument",
        "media_type",
        "producing_org",
        "transcript_text",
        "asset"
      ],

      // // maybe used in concert with filter range frontend
      // filter_attributes: [
      //   { attribute: "broadcast_date", field: "broadcast_date", type: "date" },
      // ],

      facet_attributes: [
        // { 
        //   attribute: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation.text", 
        //   field: "text", 
        //   type: "string",
        //   nestedPath: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation"
        // },
        // { 
        //   attribute: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation.annotationType.text",
        //   field: "text", 
        //   type: "string",
        //   nestedPath: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation"
        // },
        // { 
        //   attribute: "pbcoreDescriptionDocument.pbcoreAssetDate.text", 
        //   field: "text",
        //   type: "string",
        //   nestedPath: "pbcoreDescriptionDocument.pbcoreAssetDate"
        // },
        // { 
        //   attribute: "pbcoreDescriptionDocument.pbcoreGenre.text", 
        //   field: "text",
        //   type: "string",
        //   nestedPath: "pbcoreDescriptionDocument.pbcoreGenre"
        // },
        { 
          attribute: "pbcoreDescriptionDocument.pbcoreAssetType.text", 
          field: "text",
          type: "string",
          nestedPath: "pbcoreDescriptionDocument.pbcoreAssetType"
        },
        // { 
        //   attribute: "pbcoreDescriptionDocument.pbcoreDescription.text", 
        //   field: "text",
        //   type: "string",
        //   nestedPath: "pbcoreDescriptionDocument.pbcoreDescription"
        // },        
        // derived
        { 
          attribute: "producing_org", 
          field: "producing_org",
          type: "string"
        },
        { 
          attribute: "media_type", 
          field: "media_type",
          type: "string"
        },
        { 
          attribute: "access_level", 
          field: "access_level",
          type: "string"
        },
        { 
          attribute: "genres", 
          field: "genres",
          type: "string",
        },
        { 
          attribute: "contributing_orgs",
          field: "contributing_orgs",
          type: "string",
        },
        { 
          attribute: "special_collections", 
          field: "special_collections",
          type: "string",
        },
        { 
          attribute: "topics", 
          field: "topics",
          type: "string",
        },
        {
          attribute: "series_titles",
          field: "series_titles",
          type: "string"
        },
        {
          attribute: "people",
          field: "people",
          type: "string"
        },
        {
          attribute: "contributors",
          field: "contributors",
          type: "string"
        }        
      ],

      sorting: {
        _default: {
          field: "_score",
          order: "desc"
        },
        _title_keyword_asc: {
          field: "title_keyword",
          order: "asc"
        },
        _broadcast_date_desc: {
          field: "broadcast_date",
          order: "desc"
        },
      }
    }
  }

  if(searchSet == SearchSubsets.BOTH || searchSet === SearchSubsets.SEARCH_TRANSCRIPT){
    config.search_settings.runtime_mappings = {
      asset: {
        type: "lookup",
        target_index: data.esIndex,
        input_field: "guid",
        target_field: "guid",
        fetch_fields: ["title", "producing_org", "media_type"]
      },
      transcript: {
        type: "lookup",
        target_index: data.tsIndex,
        input_field: "guid",
        target_field: "guid",
        fetch_fields: ["transcript_text"]
      }
    }
  } else {
    // SearchSubsets.RECORD
    // config.search_settings.runtime_mappings = {
    //   asset: {
    //     type: 'keyword',
    //     script: {
    //       source: "emit('zapparanes')"
    //     }
    //   }
    // }
  }

  const sk = new Searchkit(config)

  const searchClient = Client(sk, {
    hooks: {
      beforeSearch: async (searchRequests) => {
        // add request to  main query request to get query doc count

        // get main query resuest
        const request = searchRequests[0]
        const activeQuery = request?.body?.query || { match_all: {} };

        const countRequest = {
          body: {
            query: activeQuery,
            size: 0,
            track_total_hits: true
          }
        }

        // add in count request to be processed too
        return [...searchRequests, countRequest];
      },
      afterSearch: async (searchRequests, searchResponses) => {
        // record doc count to state and then proceed with normal search

        // oops there it is
        const countResponse = searchResponses.pop()
        if (countResponse && countResponse.hits) {
          setCount(countResponse.hits.total.value)
        }

        // return this continue main query normally
        return searchResponses
      },
    },

    getQuery: (query, search_attributes) => {
      let queryHash
      if(searchMode === SearchModes.ORIGINAL){
        queryHash = originalSearch(query, customQuery, search_attributes, searchSet)
      } else if(searchMode === SearchModes.MULTIMATCH) {
        queryHash = multimatchSearch(query, customQuery, search_attributes, searchSet)
      } else if(searchMode === SearchModes.DISMAX){
        queryHash = dismaxSearch(query, customQuery, search_attributes, searchSet)
      } else if(searchMode === SearchModes.POSH){
        queryHash = poshSearch(query, customQuery, search_attributes, searchSet)
      } else if(searchMode === SearchModes.BOOSTY){
        queryHash = boostySearch(query, customQuery, search_attributes, searchSet)
      }

      // console.log( 'finishing with qh', query, queryHash )
      return queryHash
    }
  })

  function handleHideSearchy(newHideSearchy){
    setHideSearchy(newHideSearchy)
  }

  let searchModeToggler = (
    <div className="searchmode-toggler">
      { Object.keys(SearchModes).map((mode) => <button className={ searchMode === SearchModes[mode] ? "selected" : "" } id={ `searchmode-${SearchModes[mode]}` } onClick={ () => setSearchMode(SearchModes[mode]) } >Search { mode }</button> ) }
    </div>
  )

  return (
    <div className="body-container">
      <InstantSearch
        indexName={ currentIndexes }
        searchClient={ searchClient }
        routing={ true }
      >
        <div id="mobile-sidebar-toggler" onClick={ () => handleHideSearchy(!hideSearchy) }>
          { mobileSidebarToggler }
          <span>{ toggleMessage } Search UI</span>
        </div>

        <div className="top-search-bar bmarleft smarbot smarright">
          <div className="options-container martop">
            <h2 className="search-result-label">
              Search Results
              { searchModeToggler }
            </h2>
            
            <div className="header-spacer" />

            <div className="sort-container sort">
              Sort
              <SortBy
                items={[
                  { key: "sort1", label: "Relevance", value: `${data.esIndex}_default` },
                  { key: "sort2", label: "Title", value: `${data.esIndex}_title_keyword_asc` },
                  { key: "sort3", label: "Broadcast Date", value: `${data.esIndex}_broadcast_date_desc` },
                ]}
              />
              <ChevronDown />
            </div>
            
            <div className="sort-container per-page">
              Items per page
              <HitsPerPage
                items={ [{label: "10", value: 10},{label: "20", value: 20, default: true},{label: "50", value: 50},{label: "100", value: 100},] }
              />
              <ChevronDown />
            </div>

            <div className="sort-container view-select marright">
              <div className="view-select">
                <ViewSelect selected={ viewSelect == "standard" } viewType="standard" viewSelect={ () => setViewSelect("standard") } />
                <ViewSelect selected={ viewSelect == "gallery" } viewType="gallery" viewSelect={ () => setViewSelect("gallery") } />
                <ViewSelect selected={ viewSelect == "list" } viewType="list" viewSelect={ () => setViewSelect("list") } />
              </div>
            </div>
          </div>
        </div>

        <div className={ topRefinementsBarClasses }>

          <div className={ currentRefinementsClasses }>
            <CurrentRefinements
              transformItems={prettyCurrentRefinements}
            />
          </div>
          <div className="clear-refinements-container marright">
            <ClearRefinements translations={{ resetButtonText: "Clear Filters" }} />
            <div className="more-refinements">
              <button onClick={ () => { setShowingRefinements(!showingRefinements) } }>{showRefinementButtonText}</button>
            </div>
          </div>
        </div>

        <div id="search-sidebar" className={ sidebarClasses }>
          <h3 className="sidebar-title">
            Refine Search

            <div className="stats-container">
              <CustomStats query={ customQuery.query } count={ count } />
            </div>

          </h3>

          <hr />
          
          <SearchAccordion title="Keywords" content={ searchbox }/>

          <hr />

          <SearchAccordion title="Options" content ={
            <>
              <div>Include</div>
              <div><label>All Sources<input onChange={ () => handleSearchSet(SearchSubsets.BOTH, data.esIndex, data.tsIndex) } type="radio" value={SearchSubsets.BOTH} checked={ searchSet == SearchSubsets.BOTH ? "checked" : "" } name="search_set" /></label></div>
              <div><label>Records<input onChange={ () => handleSearchSet(SearchSubsets.RECORD, data.esIndex, data.tsIndex) } type="radio" value={SearchSubsets.RECORD} checked={ searchSet == SearchSubsets.RECORD ? "checked" : "" } name="search_set" /></label></div>
              <div><label>Transcripts<input onChange={ () => handleSearchSet(SearchSubsets.SEARCH_TRANSCRIPT, data.esIndex, data.tsIndex) } type="radio" value={SearchSubsets.SEARCH_TRANSCRIPT} checked={ searchSet == SearchSubsets.SEARCH_TRANSCRIPT ? "checked" : "" } name="search_set" /></label></div>
            </>
          }/>

          <SearchAccordion title="Broadcast Date" content={
            <>
              <div>
                <input id="startDate" type="date" name="startDate" onChange={ (e) => handleDateQuery(e.target.id, e.target.value) } />
                <div className="date-text">to</div>
                <input id="endDate" type="date" name="endDate" onChange={ (e) => handleDateQuery(e.target.id, e.target.value) } />
              </div>
            </>
          }/>

          <SearchAccordion title="Availability" content={
            <>
              <RefinementList
                attribute="access_level"
                // transformItems={ accessLevel }
              />
            </>
          }/>

          <hr />

          <SearchAccordion title="Media Type" content={
            <>
              <RefinementList
                attribute="media_type"
              />
            </>
          }/>

          <hr />

          <SearchAccordion title="Producing Organization" content={
            <>
              <RefinementList
                attribute="producing_org"
              />
            </>
          }/>

          <hr />

          <SearchAccordion title="Asset Type" startClosed={true} content={
            <>
              <RefinementList
                attribute="pbcoreDescriptionDocument.pbcoreAssetType.text"
              />
            </>
          }/>

          <hr />

          <SearchAccordion title="Genre" startClosed={true} content={
            <>
              <RefinementList
                attribute="genres"
              />
            </>
          }/>

          <hr />

          <SearchAccordion title="Topic" startClosed={true} content={
            <>
              <RefinementList
                attribute="topics"
              />
            </>
          }/>

          <SearchAccordion title="Contributing Organization" startClosed={true} content={
            <>
              <RefinementList
                attribute="contributing_orgs"
              />
            </>
          }/>

          <hr />

          <SearchAccordion title="Collection" startClosed={true} content={
            <>
              <RefinementList
                attribute="special_collections"
                transformItems={ prettyCollections }
              />
            </>
          }/>

          <hr />

          <SearchAccordion title="Series Title" startClosed={false} content={
            <>
              <RefinementList
                attribute="series_titles"
                searchable={true}
              />
            </>
          }/>

          <hr />

          <SearchAccordion title="Contributors" startClosed={false} content={
            <>
              <RefinementList
                attribute="contributors"
                searchable={true}
              />
            </>
          }/>

          <hr />

          <SearchAccordion title="Orgs & People" startClosed={false} content={
            <>
              <RefinementList
                attribute="people"
                searchable={true}
              />
            </>
          }/>

          <hr />
        </div>

        <div className="page-maincolumn bmarright">
          <div className="pagination-bar">
            { pagination }
          </div>

          <hr/>

          <Hits hitComponent={ searchResultComponent } />
          
          <div className="pagination-bar marbot">
            { pagination }
          </div>
        </div>
      </InstantSearch>
    </div>
  )
}
