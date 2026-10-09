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
        path: "pbcoreDescriptionDocument.pbcoreIdentifier",
        ignore_unmapped: true,
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
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcorePublisher.publisher",
        ignore_unmapped: true,
        query: {
    
          match: {
            "pbcoreDescriptionDocument.pbcorePublisher.publisher.text": {
              query: query,
              boost: 1
            }
          }
        }
      }
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcoreContributor.contributor",
        ignore_unmapped: true,
        query: {
    
          match: {
            "pbcoreDescriptionDocument.pbcoreContributor.contributor.text": {
              query: query,
              boost: 1
            }
          }
        }
      }
    }

  ]

  if(searchSet != SearchSubsets.RECORD){
    afArray.push({
      match: {
        transcript_text: query
      }
    })
  }

  if(searchSet === SearchSubsets.TRANSCRIPT){
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
        // dont fail the whole search if field is missing from index (only necessary for nested query, when querying multi indexes)
        ignore_unmapped: true,
        query: { term: { "pbcoreDescriptionDocument.pbcoreDescription.text": query } }
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
        path: "pbcoreDescriptionDocument.pbcoreIdentifier",
        ignore_unmapped: true,
        query: {
          term: {
            "pbcoreDescriptionDocument.pbcoreIdentifier.text": {
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
              boost: 1
            }
          }
        }
      }
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcorePublisher.publisher",
        ignore_unmapped: true,
        query: {
    
          term: {
            "pbcoreDescriptionDocument.pbcorePublisher.publisher.text": {
              value: query,
              boost: 1
            }
          }
        }
      }
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcoreContributor.contributor",
        ignore_unmapped: true,
        query: {
    
          term: {
            "pbcoreDescriptionDocument.pbcoreContributor.contributor.text": {
              value: query,
              boost: 1
            }
          }
        }
      }
    }
  ]

  if(searchSet != SearchSubsets.RECORD){
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

  if(searchSet === SearchSubsets.TRANSCRIPT){
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
        query: { match_phrase: { "pbcoreDescriptionDocument.pbcoreDescription.text": query } }
      } 
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcoreTitle",
        ignore_unmapped: true,
        query: {

          match_phrase: {
            "pbcoreDescriptionDocument.pbcoreTitle.text": {
              query: query,
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
          match_phrase: {
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
        ignore_unmapped: true,
        query: {
          match_phrase: {
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
        ignore_unmapped: true,
        query: {
    
          match_phrase: {
            "pbcoreDescriptionDocument.pbcoreCreator.creator.text": {
              query: query,
              boost: 1
            }
          }
        }
      }
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcorePublisher.publisher",
        ignore_unmapped: true,
        query: {
    
          match_phrase: {
            "pbcoreDescriptionDocument.pbcorePublisher.publisher.text": {
              query: query,
              boost: 1
            }
          }
        }
      }
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcoreContributor.contributor",
        ignore_unmapped: true,
        query: {
    
          match_phrase: {
            "pbcoreDescriptionDocument.pbcoreContributor.contributor.text": {
              query: query,
              boost: 1
            }
          }
        }
      }
    }

  ]

  if(searchSet != SearchSubsets.RECORD){
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

  if(searchSet === SearchSubsets.TRANSCRIPT){
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
  // return a bool that *should* match minimum one field with our quoty clause
  return {
    multi_match: {
      query: quoty,
      type: "phrase",
      // fields: [some field names...]
    }
  }

}

export function poshNoisyQueries(query){
  let array = [
    { match: { genres: query } },
    { match: { contributing_orgs: query } },
    { match: { special_collections: query } },
    { match: { topics: query } },
    { match: { all_titles: query } },
    { match: { series_titles: query } },
    { match: { program_titles: query } },
    { match: { episode_titles: query } },
    { match: { episode_number_titles: query } },
    { match: { segment_titles: query } },
    { match: { raw_footage_titles: query } },
    { match: { promo_titles: query } },
    { match: { clip_titles: query } },
    { match: { contributors: query } },
    { match: { creators: query } },
    { match: { publishers: query } },
    { match: { people: query } },
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
        path: "pbcoreDescriptionDocument.pbcoreIdentifier",
        ignore_unmapped: true,
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
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcorePublisher.publisher",
        ignore_unmapped: true,
        query: {
    
          match: {
            "pbcoreDescriptionDocument.pbcorePublisher.publisher.text": {
              query: query,
              boost: 1
            }
          }
        }
      }
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcoreContributor.contributor",
        ignore_unmapped: true,
        query: {
    
          match: {
            "pbcoreDescriptionDocument.pbcoreContributor.contributor.text": {
              query: query,
              boost: 1
            }
          }
        }
      }
    }

  ]

  return array
}

export function poshCleanQueries(query){
  return [
    {
      match: {
        guid: query
      }
    },
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
      match: {
        description: {
          query: query,
          analyzer: "standard",
          boost: 2
        }
      }
    },
    {
      match: {
        producing_org: {
          query: query,
          analyzer: "standard",
          boost: 1
        }
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
            }
          }
        }
      } 
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcoreDescription",
        ignore_unmapped: true,
        query: { match: { "pbcoreDescriptionDocument.pbcoreDescription.text": query } }
      } 
    },

  ]
}


export function boostyGoodQueries(query){
  return [
    {
      match: {
        guid: query
      }
    },
    {
      match: {
        description: {
          query: query,
          analyzer: "standard",
          boost: 2
        }
      }
    },
    {
      match: {
        producing_org: {
          query: query,
          analyzer: "standard",
          boost: 1
        }
      }
    }
  ]
}


export function boostyBadQueries(query){
  return [
    { match: { genres: query } },
    { match: { contributing_orgs: query } },
    { match: { special_collections: query } },
    { match: { topics: query } },
    { match: { all_titles: query } },
    { match: { series_titles: query } },
    { match: { program_titles: query } },
    { match: { episode_titles: query } },
    { match: { episode_number_titles: query } },
    { match: { segment_titles: query } },
    { match: { raw_footage_titles: query } },
    { match: { promo_titles: query } },
    { match: { clip_titles: query } },
    { match: { contributors: query } },
    { match: { creators: query } },
    { match: { publishers: query } },
    { match: { people: query } },
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
        path: "pbcoreDescriptionDocument.pbcoreIdentifier",
        ignore_unmapped: true,
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
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcorePublisher.publisher",
        ignore_unmapped: true,
        query: {
    
          match: {
            "pbcoreDescriptionDocument.pbcorePublisher.publisher.text": {
              query: query,
              boost: 1
            }
          }
        }
      }
    },
    {
      nested: {
        path: "pbcoreDescriptionDocument.pbcoreContributor.contributor",
        ignore_unmapped: true,
        query: {
    
          match: {
            "pbcoreDescriptionDocument.pbcoreContributor.contributor.text": {
              query: query,
              boost: 1
            }
          }
        }
      }
    }

  ]
}

