import { useEffect, useState } from 'react'
import { useLoaderData } from '@remix-run/react'
import Searchkit from "searchkit"
import { SortBy } from "react-instantsearch"
import Client from '@searchkit/instantsearch-client'

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
          RangeInput,
          Stats
      } from 'react-instantsearch';

import SearchResult from "../components/SearchResult"
import SearchAccordion from "../components/SearchAccordion"

export default function Search() {

  const [customQuery, setCustomQuery] = useState({
    all: null,
    title: null,
    none: null
  })

  const sk = new Searchkit({
    connection: {
      host: 'http://localhost:9200',
      apiKey: "Z1pqdVE1VUJlMTdpbU5oSXNoby06SGtSZERqY0dSaHVpS2hvbVJnMEJwdw=="
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
      result_attributes: ["guid", "title", "pbcoreDescriptionDocument"],

      facet_attributes: [
        { 
          attribute: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation.text", 
          field: "text", 
          type: "string",
          nestedPath: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation"
        },
        { 
          attribute: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation.annotationType.text",
          field: "text", 
          type: "string",
          nestedPath: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation"
        },
        { 
          attribute: "pbcoreDescriptionDocument.pbcoreAssetDate.text", 
          field: "text",
          type: "string",
          nestedPath: "pbcoreDescriptionDocument.pbcoreAssetDate"
        },
        { 
          attribute: "pbcoreDescriptionDocument.pbcoreGenre.text", 
          field: "text",
          type: "string",
          nestedPath: "pbcoreDescriptionDocument.pbcoreGenre"
        },
        { 
          attribute: "pbcoreDescriptionDocument.pbcoreAssetType.text", 
          field: "text",
          type: "string",
          nestedPath: "pbcoreDescriptionDocument.pbcoreAssetType"
        },
        { 
          attribute: "pbcoreDescriptionDocument.pbcoreDescription.text", 
          field: "text",
          type: "string",
          nestedPath: "pbcoreDescriptionDocument.pbcoreDescription"
        },        
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
        }
      ],

      sorting: {
        _default: {
          field: '_score',
          order: 'desc'
        },
        _title_desc: {
          field: 'pbcoreDescriptionDocument.pbcoreTitle.text',
          order: 'desc'
        }
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
      if(query && query.includes('\"')){
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

        // queryHash = {
        //   bool: {
        //     should: [
        //       {
        //         simple_query_string: {
        //           query: full_query,
        //           // default_operator: "and"
        //         }
        //       },
        //       {
        //         match: {
        //           "title": title_if_present || full_query
        //         }
        //       }
        //     ]
        //   }
        // }
        queryHash = {
          simple_query_string: {
            query: full_query,
            // default_operator: "and"
          }
        }

      } else {
        // no quotes -> just match these fields

        full_query = query
        if(customQuery.none && customQuery.none.length > 0){
          var none_terms = customQuery.none.split(" ")
          if(none_terms.length == 1){
            full_query += ` -${none_terms[0]}`
          } else {
            full_query += ` -${none_terms.join(" -")}`
          }
        }

        queryHash = {
          bool: {
            should: [
              // simplified syntax that works but omits options
              {
                match: {
                  "guid": full_query
                }
              },
              {
                match: {
                  "genres": full_query,
                }
              },
              {
                match: {
                  "topics": full_query,
                }
              },
              
              //full syntax w options
              {
                match: {
                  title: {
                    query: title_if_present || full_query,
                    boost: 8
                  }
                }
              },
     

              {
                nested: {
                  path: "pbcoreDescriptionDocument.pbcoreDescription",
                  query: {
                    match: {
                      "pbcoreDescriptionDocument.pbcoreDescription.text": {
                        query: full_query,
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
                        query: full_query,
                        boost: 5
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
                        query: full_query
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
                        query: full_query,
                        boost: 2
                      }
                    }
                  }
                }
              }
            ]
          }
        }

        // too rigid
        // queryHash = {
        //   query_string: {
        //     query: 'title:"Chemical Valley"'
        //   }
        // }

      }

      console.log( 'hey i can see again!!', queryHash  )
      return queryHash
    }
  })

  return (
    <div className="body-container">

      <InstantSearch
        routing={true}
        indexName="aapb_augmented"
        searchClient={ searchClient }
      >

        <div className="top-search-bar marleft marbot">
          <h2 className="">Search Results</h2>
          <Stats />
        </div>

        <div className="top-refinements-bar marbot marleft marright">
          <div className="current-refinements-container">
            <CurrentRefinements
              transformItems={prettyCurrentRefinements}
            />
          </div>
          <div className="clear-refinements-container">
            <ClearRefinements />
          </div>
          {/*<SortBy
            items={[
              { label: 'Relevance', value: 'aapb_augmented_default' },
              { label: 'Title', value: 'aapb_augmented_title_desc' }
            ]}
          />*/}


        </div>


        <div className="page-sidebar">
          <h3>Refine Search</h3>
          <hr />
          
          <SearchAccordion title="Keywords" content={
            <>
              <h4>All these words</h4>
              <SearchBox className="sidebar-search smarbot" />
              <input className="sidebar-search smarbot" type="text" onChange={ (e) => setCustomQuery({...customQuery, all: e.target.value}) } />
              <h4>This title</h4>
              <input className="sidebar-search smarbot" type="text" onChange={ (e) => setCustomQuery({...customQuery, title: e.target.value}) } />
              <h4>None of these words</h4>
              <input className="sidebar-search smarbot" type="text" onChange={ (e) => setCustomQuery({...customQuery, none: e.target.value}) } />
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

        <div className="page-maincolumn">
          <Hits hitComponent={ SearchResult } />
          <Pagination />
        </div>
      </InstantSearch>
    </div>
  )
}
