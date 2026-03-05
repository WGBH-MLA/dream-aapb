import { useEffect, useState, useRef } from 'react'
import Searchkit from "searchkit"
import Client from '@searchkit/instantsearch-client'
import { useLoaderData, useSearchParams } from 'react-router'
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
  Stats,
  useSearchBox,
  useInstantSearch,
} from 'react-instantsearch'

import BabyResult from "./BabyResult"

export default function BabySearch(props){
  const [babyQuery, setBabyQuery] = useState("")


  // get parent loader's data
  const data = useLoaderData()
  const [searchParams, setSearchParams] = useSearchParams()



  // useEffect(() => {
  //   // wow this is just ridiculous
  //   if(!window.location.href.includes("?")){
  //     console.log( 'MOVE ME' )
  //     window.location.href = `${window.location.href}?aapb-cold-steel[query]=""`
  //   }
  // })

  const sk = new Searchkit({
    connection: {
      host: props.esURL,
      apiKey: props.apiKey
    },

    search_settings: {
      // WHAT FIELDS ARE INCLUDED IN RETURNED HIT
      result_attributes: ["guid", "title", "broadcast_date", "pbcoreDescriptionDocument", "media_type", "producing_org"],
    }
  })

  function allFieldsArray(query){
    return [
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

  const searchClient = Client(sk, {
    getQuery: (query, search_attributes) => {
      var queryHash

      var mainAllFieldsArray
      mainAllFieldsArray = allFieldsArray(query)
      queryHash = {
        // top bool

        bool: {
          filter: [{
            term: {
              special_collections: props.specialCollectionTag
            }
          }],         
        }
      }

      if(query && query.length > 0){
        queryHash.bool.should = mainAllFieldsArray
      } else {
        queryHash.bool.should = [{
          // this does not ever happen ever
          term: "*"
        }]
          console.log( 'SEE?????' )

        // queryHash.bool.minimum_should_match = 1
      }
      // console.log( 'query is', queryHash )

      return queryHash
    }
  })

  function handleBabyQuery(value, refine){
    refine(value)
    // refine(value === "initial" ? "*:*" : value)
  }

  function CustomSearchBox(props) {
    const { status } = useInstantSearch()
    const { _query, refine } = useSearchBox()
    // const inputRef = useRef(null)

    const isSearchStalled = status === "stalled";
    return (
      <>
        <div>
          <h4>Search for</h4>
          <div hidden={!isSearchStalled}>Searching…</div>
          <input
            autoFocus={true}
            className="sidebar-search smarbot"
            // ref={ inputRef }
            onChange={(event) => {
              // console.log( 'I DID IT NOW' )
              setBabyQuery(event.currentTarget.value)
              props.handleBabyQuery(event.currentTarget.value, refine)
            }}

          />
        </div>
      </>
    )  
  }



        // <CustomSearchBox handleBabyQuery={ handleBabyQuery } />

  return (
    <div className="baby-search">

      <InstantSearch
        indexName={props.esIndex}
        searchClient={ searchClient }
        // routing={true}
      >

        <SearchBox
        />

        <Hits hitComponent={ BabyResult } />
        <div className="pagination-bar marbot">
          <Pagination />
        </div>
      </InstantSearch>


    </div>
  )
}

