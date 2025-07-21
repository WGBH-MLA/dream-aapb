import { useEffect, useState } from 'react'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import Searchkit from "searchkit"
import { SortBy } from "react-instantsearch"
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
          RangeInput,
          Stats
      } from 'react-instantsearch';

import SearchResult from "../components/SearchResult"
import ListResult from "../components/ListResult"
import GalleryResult from "../components/GalleryResult"
import SearchAccordion from "../components/SearchAccordion"
import ViewSelect from "../components/ViewSelect"

export const loader = async ({params, request}) => {
  return {
    indexName: process.env.ES_INDEX_NAME || "aapb_augmented_biggram",
    apiKey: process.env.ES_API_KEY,
    esURL: process.env.ES_URL
  }
}
export default function Search() {
  const data = useLoaderData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [customQuery, setCustomQuery] = useState({
    all: searchParams.get("all") || "",
    title: searchParams.get("title") || "",
    none: searchParams.get("none") || ""
  })

  let view = searchParams.get("view") || "standard"
  const [viewSelect, setViewSelect] = useState(view)

  // const [numberOfRefinements, setNumberOfRefinements] = useState(4)
  const [showingRefinements, setShowingRefinements] = useState(false)
  let currentRefinementsClasses, showRefinementButtonText
    // if(!showMoreRefinements && numberOfRefinements > 3){
  if(!showingRefinements){
    currentRefinementsClasses = "current-refinements-container closed"
    showRefinementButtonText = "Show More"
  } else {
    currentRefinementsClasses = "current-refinements-container"
    showRefinementButtonText = "Show Less"
  }

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
          attribute: "broadcast_date",
          field: "broadcast_date",
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
      if(!item.label){
        item.label = "Private"
      }

      return item
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
      case "collections":
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

  // const searchClient = Client(sk)
  const searchClient = Client(sk, {
    getQuery: (query, search_attributes) => {
      var queryHash

      var title_if_present
      if(customQuery.title && customQuery.title.length > 0){
        title_if_present = customQuery.title
      }

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
        // no quotes -> just match these fields, plus other field bee ess

        
        var mainAllFieldsArray
        // creepy quote handling
        if(false && query && query.includes('\"')){
          var quoted = query.match(/"(\\.|[^"\\])*"/g)
          var unquoted = query.replace(/"(\\.|[^"\\])*"/g, "")
          if(quoted.length > 0){
            // make a one-hit-required term array for each distinct quoted term
            queryHash.bool.filter = quoted.map( (quoterm) => allFieldsArray(quoterm) ).flat()
          }
        } else {
          mainAllFieldsArray = allFieldsArray(query)
        }

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

        if(customQuery.all && customQuery.all.length > 0){
          // add second big should clause to outer bool query
          var allQuery =  {
            bool: {
              should: allFieldsArray( customQuery.all )
            }
          }
          queryHash.bool.should.push(allQuery)
          queryHash.bool.minimum_should_match = 2
        }

        if(customQuery.none && customQuery.none.length > 0){
          // add must_not clause to big bool
          queryHash.bool.must_not = [ allFieldsTermQuery( customQuery.none ) ]
        }

        if(customQuery.title && customQuery.title.length > 0){
          queryHash.bool.must = [ titleQuery( customQuery.title ) ]
        }


        // set num of refinments for show more refinements UI
        // not working
        // setNumberOfRefinements( document.getElementsByClassName("span.ais-CurrentRefinements-category").length )

        return queryHash
      }
    }
  })

  let searchResultComponent
  if(viewSelect == "standard"){
    searchResultComponent = SearchResult
  } else if(viewSelect == "list"){
    searchResultComponent = ListResult
  } else if(viewSelect == "gallery"){
    searchResultComponent = GalleryResult
  }

  return (
    <div className="body-container">

      <InstantSearch
        routing={true}
        indexName={data.indexName}
        searchClient={ searchClient }
      >

        <div className="top-search-bar bmarleft smarbot smarright">

          <div className="options-container martop">
            <h2 className="">Search Results</h2>
            
            <div className="header-spacer" />

            <div className="sort-container marleft marright">
              Sort
              <SortBy
                items={[
                  { key: "sort1", label: "Relevance", value: "aapb_augmented_biggram_default" },
                  { key: "sort2", label: "Title", value: "aapb_augmented_biggram_title_keyword_asc" },
                  { key: "sort3", label: "Broadcast Date", value: "aapb_augmented_biggram_broadcast_date_desc" },
                ]}
              />
              <ChevronDown />
            </div>
            
            <div className="sort-container marleft marright">
              Items per page
              <HitsPerPage
                items={ [{label: "10", value: 10},{label: "20", value: 20, default: true},{label: "50", value: 50},{label: "100", value: 100},] }
              />
              <ChevronDown style={{ right: "-0.5em"}} />
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
            <>
              <h4>Search for</h4>
              <SearchBox className="sidebar-search smarbot" />
              <h4>Contains all these words</h4>
              <input value={ customQuery.all } className="sidebar-search smarbot" type="text" onChange={ (e) => setCustomQuery({...customQuery, all: e.target.value}) } />
              <h4>This title</h4>
              <input value={ customQuery.title } className="sidebar-search smarbot" type="text" onChange={ (e) => setCustomQuery({...customQuery, title: e.target.value}) } />
              <h4>None of these words</h4>
              <input value={ customQuery.none } className="sidebar-search smarbot" type="text" onChange={ (e) => setCustomQuery({...customQuery, none: e.target.value}) } />
              <div>
                <button className="sidebar-search-button">Update</button>
              </div>
            </>
          }/>

          <hr />
          
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

          <SearchAccordion title="Asset Type" startClosed={true} content={
            <>
              <RefinementList
                attribute="pbcoreDescriptionDocument.pbcoreAssetType.text"
                // transformItems={ producingOrganization }
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

          <hr />

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
        </div>

        <div className="page-maincolumn bmarright">
          <Hits hitComponent={ searchResultComponent } />
          <Pagination />
        </div>
      </InstantSearch>
    </div>
  )
}
