import { useState, useEffect, useRef } from 'react'
import { useLoaderData, useSearchParams } from 'react-router'
import Searchkit from "searchkit"
import Client from '@searchkit/instantsearch-client'
import { ChevronDown } from 'lucide-react'

const OR_FIELDS = [
  "producing_org",
  "pbcoreDescriptionDocument.pbcoreCreator.creator"
]

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
  return {
    esIndex: process.env.ES_INDEX,
    apiKey: process.env.ES_API_KEY,
    esURL: process.env.ES_URL
  }
}

function CustomStats() {
  const {
    hitsPerPage,
    nbHits,
    areHitsSorted,
    nbSortedHits,
    nbPages,
    page,
    processingTimeMS,
    query,
  } = useStats()

  return (
    <div className="ais-Stats">
      <span className="ais-Stats-text">
        Found {nbHits === 10000 ? "more than 10000" : nbHits} records in {processingTimeMS} ms
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
          className="sidebar-search smarbot"
          ref={inputRef}
          defaultValue={ props.query }
          onKeyUp={(e) => {
            props.handleCustomQuery(e.target.id, e.target.value, refine)
          }}
        />

        <h4>Contains all of these words</h4>
        <input id="all"  className="sidebar-search smarbot" type="text" onKeyUp={ (e) => props.handleCustomQuery(e.target.id, e.target.value, refine) } />
        <h4>This title</h4>
        <input id="title"  className="sidebar-search smarbot" type="text" onKeyUp={ (e) => props.handleCustomQuery(e.target.id, e.target.value, refine) } />
        <h4>None of these words</h4>
        <input id="none"  className="sidebar-search smarbot" type="text" onKeyUp={ (e) => props.handleCustomQuery(e.target.id, e.target.value, refine) } />
        <div>
          <button className="sidebar-search-button">Update</button>
        </div>
        <div hidden={!isSearchStalled}>Searching…</div>

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
    // query: "", 
    // all: "", 
    // title: "", 
    // none: "", 
    // startDate: "", 
    // endDate: "", 
  })


// include transcript in search or not
  const [searchSet, setSearchSet] = useState("both")

  let view = searchParams.get("view") || "standard"
  const [viewSelect, setViewSelect] = useState(view)

  // config viewed refinements
  const [showingRefinements, setShowingRefinements] = useState(false)

  function handleCustomQuery(type, value, refine){
    // ohh la la
    setCustomQuery({...customQuery, [type]: value})
    // console.log( 'the current complete value of customQuery is ', customQuery )

    // make sure the query param changes (harmlessly) when there's no query present, so other boxes actually work onchange
    refine(customQuery.query === "" ? " " : customQuery.query)
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
      case "series_titles":
        return "Series Title"
        break
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

  const onlyUnique = (value, index, array) => {
    return array.indexOf(value) === index
  }

  const hasQuoties = (query) => {
    return query && query.includes('\"')
  }

  const extractQuotiesFromSearchbox = (query) => {
    var quoties = pullQuotedClauses(query)
    // remove quoted clauses from the query itself
    query = query.replace(/".*?"/g ,"")
    // console.log( 'I WANT MY QUOTIES', quoties, query )

    return {
      query: query, 
      quoties: quoties
    }
  }

  // createquotyquyery???

  let currentRefinementsClasses, showRefinementButtonText
  if(!showingRefinements){
    currentRefinementsClasses = "current-refinements-container closed"
    showRefinementButtonText = "Show All"
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

  let pagination
  pagination = <Pagination />

  let searchbox
  searchbox = <CustomSearchBox
              handleCustomQuery={ handleCustomQuery }
              query={ customQuery.query }
              defaultQuery={ customQuery.query }
            />



  //////////

  
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

  function titleQueryExact(tQuery){
    // the tQuery must appear in EITHER the derived title field or a pbcoreTitle
    return {
      bool: {
        should: [
          {
            match_phrase: {
              "title": tQuery
            }
          },
          {
            nested: {
              path: "pbcoreDescriptionDocument.pbcoreTitle",
              query: {
                match_phrase: {
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
        // this is for must_not, any single match fails!
        minimum_should_match: 1
      }
    }
  }

  function allFieldsMatchPhraseArray(query){

    return [ 
      {
        match_phrase: {
          guid: query
        }
      },
      {
        match_phrase: {
          genres: query
        }
      },
      {
        match_phrase: {
          topics: query
        }
      },
      {
        match_phrase: {
          title: query
        }
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreDescription",
          query: {
            match_phrase: {
              "pbcoreDescriptionDocument.pbcoreDescription.text": query
            }
          }
        } 
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreTitle",
          query: {
            match_phrase: {
              "pbcoreDescriptionDocument.pbcoreTitle.text": query
            }
          },
        } 
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreAssetDate",
          query: {
            match_phrase: {
              "pbcoreDescriptionDocument.pbcoreAssetDate.text": query
            }
          }
        } 
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreCreator.creator",
          query: {
            match_phrase: {
              "pbcoreDescriptionDocument.pbcoreCreator.creator.text": query
            }
          }
        }
      }
    ]
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

  const isEmpty = (query) => {
    return query === "" || query.match(/^\s+$/)
  }

  const searchClient = Client(sk, {
    getQuery: (query, search_attributes) => {
      var queryHash

      var title_if_present
      if(customQuery.title && customQuery.title.length > 0){
        title_if_present = customQuery.title
      }

      var mainBoxQuoties
      if(hasQuoties(query)){
        var mainBox = extractQuotiesFromSearchbox(query)
        query = mainBox.query
        mainBoxQuoties = mainBox.quoties
      }

      // is query empty now ?
      let emptyQuery = isEmpty(query)
      
      var mainAllFieldsArray = allFieldsArray(query)

      if(emptyQuery){

        console.log( 'it aint no query' )
        // there *is not* a main box query
        queryHash = {
          // top bool
          bool: {
            // big should
            // should: []
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
      var allBox, allBoxQuoties
      if(customQuery.all && customQuery.all.length > 0){

        // lets get crazy
        var allBoxQueryString = customQuery.all
        if( hasQuoties(allBoxQueryString) ){
          // quoty me on that
          
          // we're modifying the actual value of the main query here (to remove quoties) so don't store the altered state in customQuery
           allBox = extractQuotiesFromSearchbox(allBoxQueryString)
           allBoxQueryString = allBox.query
           allBoxQuoties = allBox.quoties
          // add appropriate quoty search clauses to bool down at the end
        }

        // whether query was modified or not, go ahead and do nonquoty all query v

        // add second big should clause to outer bool query
        var allQuery
        if(allBoxQueryString && allBoxQueryString.length > 0 && !isEmpty(allBoxQueryString)){
          // only add the regular query for allbox IF there remains a NONQUOTY allbox query
          console.log( 'there is a remaining allbox query' )
          allQuery = {
            bool: {
              should: allFieldsArray( allBoxQueryString ),
              // allbox query should ALWAYS have min match one on ITS OWN BOOL, because doc doesnt match unless allboxquery appears in at least one field!
              minimum_should_match: 1
            }
          }

          // adding 'all' box query to outer bool here
          queryHash.bool.must ||= []
          queryHash.bool.must.push(allQuery)
        }
      }

      var noneBox, noneBoxQuoties
      if(customQuery.none && customQuery.none.length > 0){
        
        // lets get noney
        var noneBoxQueryString = customQuery.none        
        if( hasQuoties(noneBoxQueryString) ){
          
          // we're modifying the actual value of the none query here (to remove quoties) so don't store the altered state in customQuery
          noneBox = extractQuotiesFromSearchbox(noneBoxQueryString)
          noneBoxQueryString = noneBox.query
          noneBoxQuoties = noneBox.quoties

          // add appropriate quoty search clauses to bool down at the end
        }

        queryHash.bool.must_not ||= []

        // add must_not clause to big bool
        if(noneBoxQueryString && noneBoxQueryString.length > 0){
          // only add it IF there remains a NONQUOTY nonebox query
          queryHash.bool.must_not.push( allFieldsTermQuery(noneBoxQueryString) )
        }

        if(noneBoxQuoties && noneBoxQuoties.length > 0){
          // now also add our quoty clauses to must_not
          noneBoxQuoties.forEach( (quooty) => {
            // add all-fields-array match_phrase query for each quoty
            queryHash.bool.must_not.push( matchPhraseShouldClause(quooty) )
          })
        }
      }

      var titleBox, titleBoxQuoties
      if(customQuery.title && customQuery.title.length > 0){

        // lets get title-oriented
        var titleBoxQueryString = customQuery.title

        queryHash.bool.must ||= []
        if( hasQuoties(titleBoxQueryString) ){
          
          // we're modifying the actual value of the none query here (to remove quoties) so don't store the altered query state in customQuery
           titleBox = extractQuotiesFromSearchbox(titleBoxQueryString)
           titleBoxQueryString = titleBox.query
           titleBoxQuoties = titleBox.quoties
          
          // we add the appropriate quoty search clauses to the bool down at the end
        }

        if(titleBoxQueryString && titleBoxQueryString.length > 0){
          queryHash.bool.must.push( titleQuery(titleBoxQueryString) )
        }
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

      if(mainBoxQuoties){
        // ooh wee we got da quoties
        queryHash.bool.must ||= []
        mainBoxQuoties.forEach( (quooty) => {
          // add all-fields-array match_phrase query for each quoty

          // each quoty term *must* satisfy its *should*
          // its *should* requires at least one field to match_phrase the quoty term
          queryHash.bool.must.push( matchPhraseShouldClause(quooty) )
        })
      }

      if(allBoxQuoties){
        queryHash.bool.must ||= []
        allBoxQuoties.forEach( (quooty) => {
          queryHash.bool.must.push( matchPhraseShouldClause(quooty) )  
        })
      }

      if(titleBoxQuoties){
        queryHash.bool.must ||= []
        titleBoxQuoties.forEach( (quooty) => {
          // same query required for quoties in 'all' box vs 'main' box, so just do the exact same thing
          queryHash.bool.must.push( titleQueryExact(quooty) )
        })
      }

      console.log( 'finishing with qh', query, queryHash )
      // regahdless
      return queryHash
    }
  })

  function matchPhraseShouldClause(quoty){
    // return a bool that *should* match minimum one field with our quoty clause
    return  {
      bool: {
        should: allFieldsMatchPhraseArray(quoty),
        minimum_should_match: 1
      }
    }
  }

  function pullQuotedClauses(query){
    var result = []
    var rx = /".*?"/g
    var quoty
    while( quoty = rx.exec( query ) ) {
      if(quoty && quoty[0]){
        result.push(quoty[0].replace(/\"/g, ''))
      }
    }

    return result
  }


  return (
    <div className="body-container">
      <InstantSearch
        indexName={ data.esIndex }
        searchClient={ searchClient }
        routing={ true }
      >

        <div className="top-search-bar bmarleft smarbot smarright">
          <div className="options-container martop">
            <h2 className="search-result-label">Search Results</h2>
            
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

        <div className="top-refinements-bar smarbot bmarleft bmarright">
          <div className="stats-container">
            <CustomStats />
          </div>

          <div className={ currentRefinementsClasses }>
            <CurrentRefinements
              transformItems={prettyCurrentRefinements}
            />
          </div>
          <div className="clear-refinements-container">
            <ClearRefinements translations={{ reset: "DOMETHINGGISNGISGNS" }} />
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
              <div style={{ color: "#ddd" }}>Include</div>
              <div style={{ color: "#ddd" }}><label>All Sources<input onChange={ () => setSearchSet("both") } disabled type="radio" value="both" checked={ searchSet == "both" ? "checked" : "" } name="search_set" /></label></div>
              <div style={{ color: "#ddd" }}><label>Records<input onChange={ () => setSearchSet("records") } disabled type="radio" value="records" checked={ searchSet == "records" ? "checked" : "" } name="search_set" /></label></div>
              <div style={{ color: "#ddd" }}><label>Transcripts<input onChange={ () => setSearchSet("transcripts") } disabled type="radio" value="transcripts" checked={ searchSet == "transcripts" ? "checked" : "" } name="search_set" /></label></div>
            </>
          }/>

          <SearchAccordion title="Broadcast Date" content={
            <>
              <div>
                <input id="startDate" type="date" name="startDate" onChange={ (e) => handleCustomQuery(e.target.id, e.target.value, refine) } />
                <input id="endDate" type="date" name="endDate" onChange={ (e) => handleCustomQuery(e.target.id, e.target.value, refine) } />
              </div>
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
