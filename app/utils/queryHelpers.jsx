import { SearchSubsets } from "../utils/SearchSubsets"

export function titleQuery(tQuery){
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
            ignore_unmapped: true,
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

export function titleQueryExact(tQuery){
  // the tQuery must appear in EITHER the derived title field or a pbcoreTitle, exact match
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
            ignore_unmapped: true,
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

export function allFieldsArray(query, searchSet){

  let afArray = [
    {
      // simplified syntax that works but omits options
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
    {
      //full syntax w options
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
        // dont fail the whole search if field is missing from index (only necessary for nested query, when querying multi indexes)
        ignore_unmapped: true,
        query: { match: { "pbcoreDescriptionDocument.pbcoreDescription.text": query } }
      } 
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcoreTitle",
        ignore_unmapped: true,
        query: {

          match: {
            "pbcoreDescriptionDocument.pbcoreTitle.text": {
              query: query,
              analyzer: "standard",
              boost: 3
            }
          }
        }
      } 
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcoreAssetDate",
        ignore_unmapped: true,
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
        ignore_unmapped: true,
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

  if(searchSet != SearchSubsets.SEARCH_RECORD){
    afArray.push({
      match: {
        transcript_text: query
      }
    })
  }

  if(searchSet === SearchSubsets.SEARCH_TRANSCRIPT){
    afArray.push({
      nested:  {
        path: "asset",
        ignore_unmapped: true,
        query: {
          match: {
            "asset.title": {
              query: query
            }
          }
        }
      }
    })
  }

  return afArray
}

export function allFieldsTermArray(query, searchSet){

  let aftArray = [ 
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
        ignore_unmapped: true,
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
        ignore_unmapped: true,
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
        ignore_unmapped: true,
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
        ignore_unmapped: true,
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

  if(searchSet != SearchSubsets.SEARCH_RECORD){
    aftArray.push(
      {
        term: {
          transcript_text: {
            value: query,
            case_insensitive: true
          }
        }
      },
    )
  }

  if(searchSet === SearchSubsets.SEARCH_TRANSCRIPT){
    aftArray.push({
      nested:  {
        path: "asset",
        ignore_unmapped: true,
        query: {
          term: {
            "asset.title": {
              query: query
            }
          }
        }
      }
    })
  }

  return aftArray
}

export function allFieldsTermQuery(query, searchSet){
  // should with a term match for each field, min match 1
  // if one of these hits, the must_not clause in the big bool will remove it

  var nested_clauses = query.split(" ").map((q) => allFieldsTermArray(q, searchSet)).flat()
  return {
    bool: {
      // this is admittedly just crazy
      should: nested_clauses,
      // this is for must_not, any single match fails!
      minimum_should_match: 1
    }
  }
}

export function allFieldsMatchPhraseArray(query, searchSet){
  let afmpArray = [ 
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
        ignore_unmapped: true,
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
        ignore_unmapped: true,
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
        ignore_unmapped: true,
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
        ignore_unmapped: true,
        query: {
          match_phrase: {
            "pbcoreDescriptionDocument.pbcoreCreator.creator.text": query
          }
        }
      }
    }
  ]

  if(searchSet != SearchSubsets.SEARCH_RECORD){
    afmpArray.push(
      {
        term: {
          transcript_text: {
            value: query,
            case_insensitive: true
          }
        }
      },
    )
  }

  if(searchSet === SearchSubsets.SEARCH_TRANSCRIPT){
    afmpArray.push({
      nested: {
        path: "asset",
        ignore_unmapped: true,
        query: {
          match_phrase: {
            "asset.title": {
              query: query
            }
          }
        }
      }
    })
  }

  return afmpArray
}

export function matchPhraseShouldClause(quoty, searchSet){
  // return a bool that *should* match minimum one field with our quoty clause
  return  {
    bool: {
      should: allFieldsMatchPhraseArray(quoty, searchSet),
      minimum_should_match: 1
    }
  }
}

export function multimatchPhraseShouldClause(quoty, searchSet){

  // YOOO remember to use THIS one for dis == 3


  // return a bool that *should* match minimum one field with our quoty clause
  return {
    multi_match: {
      query: quoty,
      type: "phrase",
      // fields: [some field names...]
    }
  }

}

