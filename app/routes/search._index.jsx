import { useEffect } from 'react'
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

  const sk = new Searchkit({
    connection: {
      host: 'http://localhost:9200',
      apiKey: "Z1pqdVE1VUJlMTdpbU5oSXNoby06SGtSZERqY0dSaHVpS2hvbVJnMEJwdw=="
    },

    search_settings: {
      highlight_attributes: ["pbcoreDescriptionDocument.pbCoreTitle.text"],

      search_attributes: [ "pbcoreDescriptionDocument.pbcoreDescription","pbcoreDescriptionDocument.pbcoreTitle.first.text","pbcoreDescriptionDocument.pbcoreAnnotation.first.text","pbcoreDescriptionDocument.pbcoreIdentifier", "pbcoreDescriptionDocument.pbcoreCreator"],

      // WHAT FIELDS ARE INCLUDED IN RETURNED HIT
      result_attributes: ["pbcoreDescriptionDocument","pbcoreDescriptionDocument.pbcoreDescription"],

      facet_attributes: [
        { 
          attribute: "pbcoreDescriptionDocument.pbcoreAudienceLevel", 
          field: "pbcoreAudienceLevel", 
          type: "string",
          nestedPath: "pbcoreDescriptionDocument"
        },
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

  const sonyCiIds = (items) => {
    return items
    // return items.map((item) => {
    //   if(item.value.source == "")
    //   return item
    // })    
  }

  const accessLevelAnnotation = (items) => {
    return items.map((descdoc) => {
      if(descdoc && descdoc.pbcoreIdentifier && descdoc.pbcoreIdentifier.length > 0){
        // check for sony ci ids
        var ci_ids = descdoc.pbcoreIdentifier.filter( (id) => {
          id.source == "Sony Ci"
        })

        if(ci_ids.length > 0){
          var accessLevelAnno = descdoc.pbcoreAnnotation.find((anno) => {
            anno.annotationType == "Level of User Access"
          })

          if(accessLevelAnno){
            return {
              label: accessLevelAnno.value,
              value: accessLevelAnno.value
            }
          } else {

            return {
              label: "Private",
              value: "Private"
            }            
          }

        } else {
          return {
            label: "Private",
            value: "Private"
          }
        }
      }


    })

    // return items.filter((item) => {
    //   item.annotationsannotationType == "Level of User Access"
    // }).map((item) => {
    //   if(item.value){
    //     // item.value = item.value.replace( notYear, "")
    //     item.label = item.label + "wow ow wow!"
    //   }
      
    //   return item
    // })
      
  }


  const isOrField = (fieldName) => {  
    return OR_FIELDS.includes(fieldName)
  }

  const prettyFieldNames = (fieldName) => {
    switch(fieldName){
      case "producing_org":
        return "Producing Organization"
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
      case "pbcoreDescriptionDocument.pbcoreAssetType":
        return "Asset Type"
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

  // //produces correct values for 
  // const producingOrganization = (items, search_result_obj) => {
  //   var producingOrgs = search_result_obj.results.hits.map((hit) => {
  //     return hit.pbcoreDescriptionDocument.pbcoreCreator.filter((pbc) => pbc.creatorRole == "Producing Organization").map((pbc) => pbc.creator )
  //   }).flat().filter(onlyUnique)
  //   return items.filter((facetEntry) => producingOrgs.some((producingOrg) => producingOrg == facetEntry.value))
  // }

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  const searchClient = Client(sk, {
    getQuery: (query, search_attributes) => {
      return {
        bool: {
          should: [
            {
              nested: {
                path: "pbcoreDescriptionDocument",
                query: {
                  match: {
                    "pbcoreDescriptionDocument": {
                      query: query
                    }
                  }
                }
              } 
            },
            {
              nested: {
                path: "pbcoreDescriptionDocument.pbcoreDescription",
                query: {
                  match: {
                    "pbcoreDescriptionDocument.pbcoreDescription.text": {
                      query: query
                    }
                  }
                }
              } 
            },
            {
              nested: {
                // PATH MUST GO TO THE FIELD A LEVEL ABOVE THE TARGET, NOTTTTTTT THE TOP LEVEL FIELD
                path: "pbcoreDescriptionDocument.pbcoreTitle",
                query: {
                  match: {
                    "pbcoreDescriptionDocument.pbcoreTitle.text": {
                      query: query
                    }
                  }
                }
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
                path: "pbcoreDescriptionDocument.pbcoreIdentifier",
                query: {
                  match: {
                    "pbcoreDescriptionDocument.pbcoreIdentifier.text": {
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
                      query: query
                    }
                  }
                }
              }
            },
            {
              nested: {
                path: "pbcoreDescriptionDocument.pbcoreGenre",
                query: {
                  match: {
                    "pbcoreDescriptionDocument.pbcoreGenre.text": {
                      query: query
                    }
                  }
                }
              }
            }
          ]
        }
      }
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
              <SearchBox className="sidebar-search smarbot" autoFocus />
              <h4>This title</h4>
              <input className="sidebar-search smarbot" type="text" />
              <h4>This exact word or phrase</h4>
              <input className="sidebar-search smarbot" type="text" />
              <h4>None of these words</h4>
              <input className="sidebar-search smarbot" type="text" />
            </>
          }/>

          <hr />
          
          <SearchAccordion title="Availability" content={
            <>
              <RefinementList
                attribute="access_level"
                // transformItems={ accessLevelAnnotation }
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
                attribute="pbcoreDescriptionDocument.pbcoreAssetType"
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
                attribute="collections"
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
