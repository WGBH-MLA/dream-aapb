export async function getRecord(guid, esURL, esIndex, esAPIKey){

  var query = { "query": {"match_phrase": { "guid": guid } } }
  var data = await executeQuery(query, esURL, esIndex, esAPIKey)
  if(data && data.hits && data.hits.hits && data.hits.hits[0] && data.hits.hits[0]._source){
    //mix in the es doc id so we can use that for related records
    return {...data.hits.hits[0]._source, id: data.hits.hits[0]._id}
  }  
}

export async function getRecords(guids, esURL, esIndex, esAPIKey){
  let guidClauses = guids.map((guid) => { return {"match_phrase": {"guid": guid}} } )
  var query = {
    "query": {
      "bool": {
        // should so different clauses matching works, but match_phrase so no partial field matching (unrelated guids hitting instead of exact match)
        "should": guidClauses,
      }
    }
  }

  var data
  data = await executeQuery(query, esURL, esIndex, esAPIKey)

  if(data && data.hits && data.hits.hits ){
    if(data.hits.hits[0] && data.hits.hits[0]._source){
      //mix in the es doc id so we can use that for related records
      return data.hits.hits.map((hit) => { return {...hit._source, id: hit._id} })
    } else {
      return []
    }
  }
}

async function executeQuery(query, esURL, esIndex, esAPIKey){
  var url = `${esURL}/${esIndex}/_search`
  var response = await fetch(url, { 
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `ApiKey ${esAPIKey}` },
    body: JSON.stringify(query) 
  })

  var data = await response.json()
  // console.log( 'DATAVERSE REPORT::::::: ', data )
  return data
}
