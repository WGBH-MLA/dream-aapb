export async function getRecord(guid){
  var url = `${process.env.ES_URL}/${process.env.ES_INDEX}/_search`
  var response = await fetch(url, { 
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `ApiKey ${ process.env.ES_API_KEY }` },
      body: JSON.stringify({ "query": {"match_phrase": { "guid": guid } } }) 
    })

  var data = await response.json()
  if(data && data.hits && data.hits.hits && data.hits.hits[0] && data.hits.hits[0]._source){
    return data.hits.hits[0]._source
  }
}
