export default async function randomRecords(num){
  if(!num || num < 1){
    throw "that is just not an appropriate number okayyyyy??"
  }

  let esIndex = process.env.ES_INDEX || "aapb_catalog_v1"
  let esURL = process.env.ES_URL || "https://elastic.dev.wgbh-mla.org"
  let apiKey = process.env.ES_API_KEY || "bjVNcTVwc0JXX1JRWThNV091ZTc6WDdiUG0tVHl5dlE2M2dYaUctcnFodw=="

  var url = `${esURL}/${esIndex}/_search`

  try {    
    var response = await fetch(url, { 
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `ApiKey ${ apiKey }` },
      // body: JSON.stringify({ "size": num, "query": {"function_score": { "functions": [{ "random_score": { "seed": Date.now() } }], "score_mode": "sum" } } }) 
      body: JSON.stringify({ "size": num, "query": { "function_score": { "query": { "match_all": {} }, "functions": [ { "random_score": {} } ] } } }) 
    })

  } catch(error){
    console.log( "it seems that we've experienced a bit of an oopsie!", error )
    return []
  }
  var data = await response.json()
  if(data && data.hits && data.hits.hits && data.hits.hits){
    return data.hits.hits.map( (hit) => hit._source )
  }
}
