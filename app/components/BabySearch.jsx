import { useEffect, useState, useRef } from 'react'
import Searchkit from "searchkit"
import Client from '@searchkit/instantsearch-client'
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
      console.log( 'query is', query )
      var queryHash

      var mainAllFieldsArray
      mainAllFieldsArray = allFieldsArray(query)
      queryHash = {
        // top bool

        bool: {
          filter: [
            {
              term: {
                special_collections: props.specialCollectionTag
              }
            },
          ]
        }
      }

      // if(query && query.length > 0){
        queryHash.bool.should = allFieldsArray
      // } else {
      //   queryHash.bool.should = [{
      //     term: "*"
      //   }]

        queryHash.bool.minimum_should_match = 1
      // }

      return queryHash
    }
  })

  function handleBabyQuery(value, refine){
    setBabyQuery(value)
    refine(babyQuery === "" ? "*:*" : babyQuery)
  }

  function CustomSearchBox(props) {
    const { status } = useInstantSearch()
    const { _query, refine } = useSearchBox()
    const inputRef = useRef(null)

    const isSearchStalled = status === "stalled";
    return (
      <>
        <div>
          <h4>Search for</h4>
          <div hidden={!isSearchStalled}>Searching…</div>
          <input
            autoFocus={ true }
            className="sidebar-search smarbot"
            ref={ inputRef }
            onKeyUp={(event) => {
              props.handleBabyQuery(event.currentTarget.value, refine)
            }}
          />
        </div>
      </>
    )  
  }


// <CustomSearchBox handleBabyQuery={ handleBabyQuery } />

  useEffect(() => {

  })

  return (
    <div className="baby-search">

      <InstantSearch
        indexName={props.indexName}
        searchClient={ searchClient }
        routing={true}
      >
        <SearchBox />
        { babyQuery }
        <Hits hitComponent={ BabyResult } />
        <div className="pagination-bar marbot">
          <Pagination />
        </div>
      </InstantSearch>


    </div>
  )
}

