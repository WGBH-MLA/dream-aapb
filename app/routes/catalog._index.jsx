import { useState, useEffect, useRef } from 'react'
import { useLoaderData, useSearchParams, useNavigate } from 'react-router'
import Searchkit from "searchkit"
import Client from '@searchkit/instantsearch-client'
import { ChevronDown } from 'lucide-react'

const OR_FIELDS = [
  "producing_org",
  "pbcoreDescriptionDocument.pbcoreCreator.creator"
]

// import your InstantSearch components
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
          Stats,
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
  return {
    esIndex: process.env.ES_INDEX || "dream-aapb-temporary",
    apiKey: process.env.ES_API_KEY,
    esURL: process.env.ES_URL
  }
}

function CustomSearchArea(props){
  const navigateHook = useNavigate()

  const [justArrived, setJustArrived] = useState(true)

  // include transcript in search or not
  const [searchSet, setSearchSet] = useState("both")
  
  const { _query, refine } = useSearchBox()

  let view = props.searchParams.get("view") || "standard"
  const [viewSelect, setViewSelect] = useState(view)

  // config viewed refinements
  const [showingRefinements, setShowingRefinements] = useState(false)
  let currentRefinementsClasses, showRefinementButtonText
  if(!showingRefinements){
    currentRefinementsClasses = "current-refinements-container closed"
    showRefinementButtonText = "Show All Refinements"
  } else {
    currentRefinementsClasses = "current-refinements-container"
    showRefinementButtonText = "Show Less"
  }

  let searchResultComponent
  if(viewSelect == "standard"){
    searchResultComponent = SearchResult
  } else if(viewSelect == "list"){
    searchResultComponent = ListResult
  } else if(viewSelect == "gallery"){
    searchResultComponent = GalleryResult
  }


// none of this garbage works
  useEffect(() => {
  //   let urlSearch = props.searchParams.get(`${props.esIndex}[query]`)
  //   // if(justArrived && urlSearch && urlSearch.length > 0 || urlSearch != props.customQuery.query){
  //     console.log( 'well, ive only just arrived!! but ill try to apply your params!!', urlSearch, props.customQuery.query )

    props.setCustomQuery({
      query: props.searchParams.get(`${props.esIndex}[query]`) || "",
      all: props.searchParams.get("all") || "",
      title: props.searchParams.get("title") || "",
      none: props.searchParams.get("none") || "",
      startDate: props.searchParams.get("startDate") || "",
      endDate: props.searchParams.get("endDate") || "",
    })




  //     // this doesn't seem to filter down, does search correctly but wont sync up with the CustomSearchBox
  //     // set query to urlsearch and refine
  //     // props.handleCustomQuery("query", urlSearch, refine)

  //   // bad!
  //   // let layoutInputs = document.querySelectorAll("input.layout-input")
  //   // for(let input of layoutInputs){
  //   //   console.log( 'setto ni!!', input, props.customQuery.query )
  //   //   input.value = props.customQuery.query
  //   // }
  }, [])



  ////
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

  const accessLevel = (items) => {
    return items.map( (item) => {
      if(item.label == "Online Reading Room"){
        item.label = "Available Online"
      } else if(item.label == "On Location"){
        item.label = "All Digitized"
      } else {
        // private or nothing
        item.label = "All Records"
      }

      return item
    }).sort((a,b) => {
      // sort availabilty options a-z so they dont jump around ui based on num results
      if(a < b){
        return 1
      } else {
        return -1
      }
    })
  }

  const isOrField = (fieldName) => {  
    return OR_FIELDS.includes(fieldName)
  }

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
    }
  }

  const prettyCurrentRefinements = (attributes) => {
    attributes.map((attribute) => {

      let refs = attribute.refinements.map((ref) => {
        // label is the actual facet field value which seems slightly weird
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

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
  ////


  let searchbox
  searchbox = <CustomSearchBox
              refine={ refine }
              handleCustomQuery={ props.handleCustomQuery }
              query={ props.customQuery.query }
              defaultQuery={ props.customQuery.query }
            />


  return (
    <>
      <div className="top-search-bar bmarleft smarbot smarright">
        <div className="options-container martop">
          <h2 className="">Search Results</h2>
          
          <div className="header-spacer" />

          <div className="sort-container sort marleft marright">
            Sort
            <SortBy
              items={[
                { key: "sort1", label: "Relevance", value: `${props.esIndex}_default` },
                { key: "sort2", label: "Title", value: `${props.esIndex}_title_keyword_asc` },
                { key: "sort3", label: "Broadcast Date", value: `${props.esIndex}_broadcast_date_desc` },
              ]}
            />
            <ChevronDown style={{ right: "18px"}} />
          </div>
          
          <div className="sort-container per-page marleft marright">
            Items per page
            <HitsPerPage
              items={ [{label: "10", value: 10},{label: "20", value: 20, default: true},{label: "50", value: 50},{label: "100", value: 100},] }
            />
            <ChevronDown />
          </div>

          <div className="marleft marright">
            <ViewSelect selected={ viewSelect == "standard" } viewType="standard" viewSelect={ () => setViewSelect("standard") } />
            <ViewSelect selected={ viewSelect == "gallery" } viewType="gallery" viewSelect={ () => setViewSelect("gallery") } />
            <ViewSelect selected={ viewSelect == "list" } viewType="list" viewSelect={ () => setViewSelect("list") } />
          </div>
        </div>
        

      </div>

      <div className="top-refinements-bar marbot bmarleft bmarright">
        <div className="stats-container">
          <Stats />
        </div>

        <div className={ currentRefinementsClasses }>
          <CurrentRefinements
            transformItems={prettyCurrentRefinements}
          />
        </div>
        <div className="clear-refinements-container">
          <ClearRefinements />
          <div className="more-refinements">
            <button onClick={ () => { setShowingRefinements(!showingRefinements) } }>{showRefinementButtonText}</button>
          </div>
        </div>
      </div>

      <div className="page-sidebar bmarleft">
        <h3 className="sidebar-title">Refine Search</h3>
        <hr />
        
        <SearchAccordion title="Keywords" content={
          searchbox
        }/>

        <hr />

        <SearchAccordion title="Options" content ={
          <>
            <div>Include</div>
            <div><label>All Sources<input onChange={ () => setSearchSet("both") } type="radio" value="both" checked={ searchSet == "both" ? "checked" : "" } name="search_set" /></label></div>
            <div><label>Records<input onChange={ () => setSearchSet("records") } type="radio" value="records" checked={ searchSet == "records" ? "checked" : "" } name="search_set" /></label></div>
            <div><label>Transcripts<input onChange={ () => setSearchSet("transcripts") } type="radio" value="transcripts" checked={ searchSet == "transcripts" ? "checked" : "" } name="search_set" /></label></div>
          </>
        }/>

        <SearchAccordion title="Broadcast Date" content={
          <>
            <div><input id="startDate" type="date" name="startDate" onChange={ (e) => handleCustomQuery(e.target.id, e.target.value, refine) } /></div>
            <div><input id="endDate" type="date" name="endDate" onChange={ (e) => handleCustomQuery(e.target.id, e.target.value, refine) } /></div>
          </>
        }/>

        <SearchAccordion title="Availability" content={
          <>
            <RefinementList
              attribute="access_level"
              transformItems={ accessLevel }
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
              // transformItems={ producingOrganization }
            />
          </>
        }/>

        <hr />

        <SearchAccordion title="Asset Type" startClosed={true} content={
          <>
            <RefinementList
              attribute="pbcoreDescriptionDocument.pbcoreAssetType.text"
              // transformItems={ producingOrganization }
            />
          </>
        }/>

        <hr />

        <SearchAccordion title="Genre" startClosed={true} content={
          <>
            <RefinementList
              attribute="genres"
              // transformItems={ producingOrganization }
            />
          </>
        }/>

        <hr />

        <SearchAccordion title="Topic" startClosed={true} content={
          <>
            <RefinementList
              attribute="topics"
              // transformItems={ producingOrganization }
            />
          </>
        }/>

        <SearchAccordion title="Contributing Organization" startClosed={true} content={
          <>
            <RefinementList
              attribute="contributing_orgs"
              // transformItems={ producingOrganization }
            />
          </>
        }/>

        <hr />

        <SearchAccordion title="Collection" startClosed={true} content={
          <>
            <RefinementList
              attribute="special_collections"
              // transformItems={ producingOrganization }
            />
          </>
        }/>

        <hr />

        <SearchAccordion title="Series Title" startClosed={false} content={
          <>
            <RefinementList
              attribute="series_titles"
              searchable={true}

              // transformItems={ producingOrganization }
            />
          </>
        }/>

        <hr />          
      </div>

      <div className="page-maincolumn bmarright">

        <div className="pagination-bar">
          <Pagination />
        </div>

        <hr/>

        <Hits hitComponent={ searchResultComponent } />
        <div className="pagination-bar marbot">
          <Pagination />
        </div>
      </div>
    </>
  )
}

function CustomSearchBox(props) {
  const { status } = useInstantSearch()
  const inputRef = useRef(null)
  const isSearchStalled = status === "stalled";

  return (
    <>
      <div className="">
        <h4>Search for</h4>
        <input
          id="query"
          className="sidebar-search smarbot"
          ref={inputRef}
          defaultValue={ props.query }
          onKeyUp={(e) => {
            props.handleCustomQuery(e.target.id, e.target.value, props.refine)
          }}
        />

        <div hidden={!isSearchStalled}>Searching…</div>
        <h4>Contains all of these words</h4>
        <input id="all"  className="sidebar-search smarbot" type="text" onKeyUp={ (e) => props.handleCustomQuery(e.target.id, e.target.value, props.refine) } />
        <h4>This title</h4>
        <input id="title"  className="sidebar-search smarbot" type="text" onKeyUp={ (e) => props.handleCustomQuery(e.target.id, e.target.value, props.refine) } />
        <h4>None of these words</h4>
        <input id="none"  className="sidebar-search smarbot" type="text" onKeyUp={ (e) => props.handleCustomQuery(e.target.id, e.target.value, props.refine) } />
        <div>
          <button className="sidebar-search-button">Update</button>
        </div>

      </div>
    </>
  )  
}

export default function Catalog() {
  const data = useLoaderData()


  // state that we need out here, and down inside the search area...
  const [searchParams, setSearchParams] = useSearchParams()
  const [customQuery, setCustomQuery] = useState({
    query: searchParams.get(`${data.esIndex}[query]`) || "",
    all: searchParams.get("all") || "",
    title: searchParams.get("title") || "",
    none: searchParams.get("none") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  })

  function handleCustomQuery(type, value, refine){
    // ohh la la
    setCustomQuery({...customQuery, [type]: value})
    // console.log( 'the current complete value of customQuery is ', customQuery )

    // let layoutInputs = document.getElementsByClassName("layout-input")
    // console.log( 'LAYOUOOOOO', layoutInputs )

    
      // make sure the query param changes (harmlessly) when there's no query present, so other boxes actually work onchange
      // refine(customQuery.query === "" ? " " : customQuery.query)
      refine(customQuery.query)
      // setCustomQuery({...customQuery, lastQuery: customQuery.query})
    // }
  }



  
  // othiz
  function titleQuery(tQuery){
    // the tQuery must appear in EITHER the derived title field or a pbcoreTitle
    return {
      bool: {
        should: [
          {
            match: {
              "title": tQuery
            }
          },
          {
            nested: {
              path: "pbcoreDescriptionDocument.pbcoreTitle",
              query: {
                match: {
                  "pbcoreDescriptionDocument.pbcoreTitle.text": {
                    query: tQuery,
                  }
                }
              }
            } 
          },
        ],
        minimum_should_match: 1
      }
    }
  }

  function allFieldsArray(query){
    return [
      // simplified syntax that works but omits options
      {
        match: {
          "guid": query
        }
      },
      {
        match: {
          "genres": query,
        }
      },
      {
        match: {
          "topics": query,
        }
      },
      
      //full syntax w options
      {
        match: {
          title: {
            query: query,
            analyzer: "standard",
            boost: 4
          }
        }
      },

      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreDescription",
          query: {
            match: {
              "pbcoreDescriptionDocument.pbcoreDescription.text": {
                query: query,
              }
            }
          }
        } 
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreTitle",
          query: {
            match: {
              "pbcoreDescriptionDocument.pbcoreTitle.text": {
                query: query,
                analyzer: "standard",
                boost: 3
              }
            }
          },
        } 
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreAssetDate",
          query: {
            match: {
              "pbcoreDescriptionDocument.pbcoreAssetDate.text": {
                query: query
              }
            }
          }
        } 
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreCreator.creator",
          query: {
            match: {
              "pbcoreDescriptionDocument.pbcoreCreator.creator.text": {
                query: query,
                boost: 1
              }
            }
          }
        }
      }
    ]
  }

  function allFieldsTermArray(query){

    return [ 
      {
        term: {
          guid: {
            value: query,
            case_insensitive: true
          }
        }
      },
      {
        term: {
          genres: {
            value: query,
            case_insensitive: true
          }
        }
      },
      {
        term: {
          topics: {
            value: query,
            case_insensitive: true
          }
        }
      },
      {
        term: {
          title: {
            value: query,
            case_insensitive: true
          }
        }
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreDescription",
          query: {
            term: {
              "pbcoreDescriptionDocument.pbcoreDescription.text": {
                value: query,
                case_insensitive: true
              }
            }
          }
        } 
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreTitle",
          query: {
            term: {
              "pbcoreDescriptionDocument.pbcoreTitle.text": {
                value: query,
                case_insensitive: true
              }
            }
          },
        } 
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreAssetDate",
          query: {
            term: {
              "pbcoreDescriptionDocument.pbcoreAssetDate.text": {
                value: query
              }
            }
          }
        } 
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreCreator.creator",
          query: {
            term: {
              "pbcoreDescriptionDocument.pbcoreCreator.creator.text": {
                value: query,
                case_insensitive: true
              }
            }
          }
        }
      }
    ]
  }

  function allFieldsTermQuery(query){
    // should with a term match for each field, min match 1
    // if one of these hits, the must_not clause in the big bool will remove it

    var nested_clauses = query.split(" ").map((q) => allFieldsTermArray(q)).flat()
    return {
      bool: {
        // this is admittedly just crazy
        should: nested_clauses,
        // this is for must_not, any match fails!
        minimum_should_match: 1
      }
    }
  }


  const sk = new Searchkit({
    connection: {
      host: data.esURL,
      apiKey: data.apiKey
    },

    search_settings: {
      highlight_attributes: ["pbcoreDescriptionDocument.pbcoreTitle.text"],

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
      result_attributes: ["guid", "title", "broadcast_date", "pbcoreDescriptionDocument", "media_type", "producing_org"],

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
  })

  // const searchClient = Client(sk)
  const searchClient = Client(sk, {
    getQuery: (query, search_attributes) => {
      let emptyQuery = query === "" || query.match(/^\s+$/)
      var queryHash

      // console.log( 'Search was triggered with custom', customQuery )
      var title_if_present
      if(customQuery.title && customQuery.title.length > 0){
        title_if_present = customQuery.title
      }

      // console.log( 'i doa the date', customQuery.startDate, customQuery.endDate )
      // look for quoted phrases in the main search box
      if(false && query && query.includes('\"')){
        var quoted = query.match(/"(\\.|[^"\\])*"/g)
        var unquoted = query.replace(/"(\\.|[^"\\])*"/g, "")

        var full_query
        if(quoted && quoted.length > 0){
          // require one of quoted strings, or optional everything else unquoted
          full_query = `+${quoted.join(" | +")}`

          if(unquoted.length > 0 && unquoted.trim().length > 0){
            full_query = full_query + ` OR (${unquoted})`
          }
        } else {
          full_query = unquoted
        }

        if(customQuery.none && customQuery.none.length > 0){
          var none_terms = customQuery.none.split(" ")
          full_query += ` -(${none_terms.join(" OR ")})`
        }

        queryHash = {
          simple_query_string: {
            query: full_query,
            // default_operator: "and"
          }
        }

      } else {
        
        var mainAllFieldsArray
        // broken creepy quote handling
        if(false && query && query.includes('\"')){
          var quoted = query.match(/"(\\.|[^"\\])*"/g)
          var unquoted = query.replace(/"(\\.|[^"\\])*"/g, "")
          if(quoted.length > 0){
            // console.log( 'dummbo', quoted, unquoted )
            // make a one-hit-required term array for each distinct quoted term

            // todo fix this!! dates use filtering now
            queryHash.bool.filter = quoted.reduce().map( (quoterm) => allFieldsArray(quoterm.replace(/['"]+/g, '')) ).flat()
          }

        } else {
          // big main compound query...
          mainAllFieldsArray = allFieldsArray(query)
        }

        if(emptyQuery){
          // there *is not* a main box query
          queryHash = {
            // top bool
            bool: {
              // big should
              should: []
            }
          }
        } else {
          // there *is* a main box query
          queryHash = {
            // top bool
            bool: {
              // big should
              should: [
                {
                  bool: {
                    should: mainAllFieldsArray,
                    minimum_should_match: 1
                  }
                }
              ]
            }
          }
        }

        // add in clauses for each of 3 secondary searchbox fields
        if(customQuery.all && customQuery.all.length > 0){
          // add second big should clause to outer bool query
          var allQuery =  {
            bool: {
              should: allFieldsArray( customQuery.all )
            }
          }
          queryHash.bool.should.push(allQuery)
          if(emptyQuery){
            // no quer present
            queryHash.bool.minimum_should_match = 1
          } else {
            // normal 
            // require a hit on the main clause, and also this 'all terms' one
            queryHash.bool.minimum_should_match = 2
          }
        }

        if(customQuery.none && customQuery.none.length > 0){
          // add must_not clause to big bool
          queryHash.bool.must_not = [ allFieldsTermQuery( customQuery.none ) ]
        }

        if(customQuery.title && customQuery.title.length > 0){
          queryHash.bool.must = [ titleQuery( customQuery.title ) ]
        }

        if(customQuery.startDate || customQuery.endDate){
          queryHash.bool.filter = {
            range: {
              broadcast_date: {}
            }
          }

          if(customQuery.startDate){
            queryHash.bool.filter.range.broadcast_date.gt = customQuery.startDate
          }

          if(customQuery.endDate){
            queryHash.bool.filter.range.broadcast_date.lt = customQuery.endDate
          }
        }

        // console.log( 'finishing with qh', query, queryHash )
        return queryHash
      }
    }
  })

  // url params should always take over box state so linked searches work correclty
  // let queryFromURL = searchParams.get(`${data.esIndex}[query]`)
  // if(queryFromURL && (!customQuery.query || customQuery.query != queryFromURL)){
  //   setCustomQuery({...customQuery, query: queryFromURL})
  // }
  

  return (
    <div className="body-container">
      <InstantSearch
        indexName={ data.esIndex }
        searchClient={ searchClient }
        routing={ true }
      >
        <CustomSearchArea
          esIndex={ data.esIndex }

          // state needed inside getQuery method AND inside the area
          searchParams={ searchParams }
          customQuery={ customQuery }
          setCustomQuery={ setCustomQuery }
          handleCustomQuery={ handleCustomQuery }
        />

      </InstantSearch>
    </div>
  )
}
