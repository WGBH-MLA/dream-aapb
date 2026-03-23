export async function getRecord(guid, esURL, esIndex, esAPIKey){
  var query = { "query": {"match_phrase": { "guid": guid } } }
  var data = await executeQuery(query, esURL, esIndex, esAPIKey)
  if(data && data.hits && data.hits.hits && data.hits.hits[0] && data.hits.hits[0]._source){
    return data.hits.hits[0]._source
  }  
}

export async function getRecordPromise(guid, esURL, esIndex, esAPIKey){
  var query = { "query": {"match_phrase": { "guid": guid } } }
  return executeQuery(query, esURL, esIndex, esAPIKey)
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
      // console.log( 'hey bumba', data.hits.hits[0]._source )
      return data.hits.hits.map((hit) => hit._source)
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
