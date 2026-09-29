export default class MoreLikeThis {
  constructor(config, numRecords=4){
    if(!config || !config.esIndex || !config.esURL || !config.esAPIKey){
       throw "bad mlt config!!!"
    }

    this.config = config
    this.numRecords = numRecords
  }
  
  async getMoreLikeThis(doc_ids, field_list){
    // must be 1 index, doesnt work with index,otherindex format here v
    var url = `${this.config.esURL}/${this.config.esIndex}/_search`
    var idsClause = doc_ids.map((doc_id) => { return { _index: this.config.esIndex, _id: doc_id } } )

    // // original
    // var query = {
    //   size: this.numRecords,
    //   query: {
    //     more_like_this: {
    //       // because we use doc ids rather than just text or field value query to find mlt, we seem to have to specify fields explciitly
    //       fields: field_list,
    //       like: idsClause,
    //       min_term_freq: 1,
    //       max_query_terms: 1024,
    //       // otherwise, input doc is too few
    //       min_doc_freq: 1
    //     }
    //   }
    // }

    var query = {
      size: this.numRecords,
      query: {
        bool: {
          should: [
            // regular mlt
            {
              more_like_this: {
                fields: ["all_titles"],
                like: idsClause,
                min_term_freq: 1,
                max_query_terms: 1024,
                min_doc_freq: 1
              }
            },
            // nested query is the only way to access nested field via query but we can do mlt inside it
            {
              nested: {
                path: "pbcoreDescriptionDocument.pbcoreDescription",
                query: {
                  more_like_this: {
                    fields: ["pbcoreDescriptionDocument.pbcoreDescription.text"],
                    like: idsClause,
                    min_term_freq: 1,
                    max_query_terms: 1024,
                    min_doc_freq: 1
                  }
                }
              }      
            }
          ]
        }
      }
    }

    var response = await fetch(url, { 
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `ApiKey ${this.config.esAPIKey}` },
      body: JSON.stringify(query) 
    })

    var data = await response.json()
    if(data.hits && data.hits.hits){
      return data.hits.hits.map((hit) => { return {...hit._source, id: hit._id} })
    } else {
      return []
    }
  }

}
