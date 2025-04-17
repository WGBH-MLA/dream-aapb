import { useLoaderData } from '@remix-run/react'
import Searchkit from "searchkit"
import Client from '@searchkit/instantsearch-client'

// import your InstantSearch components
import {
          InstantSearch,
          SearchBox,
          Hits,
          RefinementList,
          CurrentRefinements,
          ToggleRefinement,
          Pagination,
          RangeInput
      } from 'react-instantsearch';

import SearchResult from "../components/SearchResult"

export default function Search() {

  const sk = new Searchkit({
    connection: {
      host: 'http://localhost:9200',
      // with an apiKey
      // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-api-key
      apiKey: "Z1pqdVE1VUJlMTdpbU5oSXNoby06SGtSZERqY0dSaHVpS2hvbVJnMEJwdw=="
      // with a username/password
      // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-usernamepassword
      //auth: {
      //  username: "elastic",
      //  password: "changeme"
      //}
    },

    search_settings: {
      highlight_attributes: ["pbcoreDescriptionDocument.pbCoreTitle.text"],

      search_attributes: [ "pbcoreDescriptionDocument.pbcoreDescription","pbcoreDescriptionDocument.pbcoreTitle.first.text","pbcoreDescriptionDocument.pbcoreAnnotation.first.text","pbcoreDescriptionDocument.pbcoreIdentifier", ],
      // search_attributes: [ "pbcoreDescriptionDocument.pbcoreTitle.text"],

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
          attribute: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation.annotationType", 
          field: "annotationType", 
          type: "string",
          nestedPath: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation"
        },
        { 
          attribute: "pbcoreDescriptionDocument.pbcoreAssetDate.text", 
          field: "text",
          type: "string",
          nestedPath: "pbcoreDescriptionDocument.pbcoreAssetDate"
        }
      ]
    },
  })

        // <div>IDs:<ul>{ hit && hit.pbcoreDescriptionDocument.pbcoreIdentifier ? hit.pbcoreDescriptionDocument.pbcoreIdentifier.map( (id,i) => <li key={i}>{id.source}: {id?.text}</li>) : "No IDs" }</ul></div>



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
    console.log( 'hey now hey now', items )
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
                path: "pbcoreDescriptionDocument",
                query: {
                  match: {
                    "pbcoreDescriptionDocument.pbcoreDescription": {
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
            }
          ]
        }
      }
    }
  })

  return (
    <div className="body-container">

      <InstantSearch
        indexName="aapb"
        searchClient={ searchClient }
      >
        <div className="page-sidebar">
          <SearchBox autoFocus />

          Availability
          <RefinementList
            attribute="pbcoreDescriptionDocument"
            transformItems={ accessLevelAnnotation }
          />

          Digitized?
          <RefinementList
            attribute="pbcoreDescriptionDocument.pbcoreIdentifier.text"
            transformItems={ sonyCiIds }
          />

          Annotation Type
          <RefinementList
            attribute="pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation.annotationType"
          />

          Annotation Text
          <RefinementList
            attribute="pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation.text"
          />

          Asset Year
          <RefinementList
            attribute="pbcoreDescriptionDocument.pbcoreAssetDate.text"
            searchable={true}
            transformItems={ dateToYear }
          />          
          <CurrentRefinements />
        </div>
        <div className="page-maincolumn">
          <Hits hitComponent={SearchResult} />
          <Pagination />
        </div>
      </InstantSearch>
    </div>
  )
}
