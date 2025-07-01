export default async function randomRecords(num){
  if(!num || num < 1){
    throw "that is just not an appropriate number okayyyyy??"
  }
  var url = `${process.env.ES_URL}/${process.env.ES_INDEX_NAME}/_search`
  var response = await fetch(url, { 
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `ApiKey ${ process.env.ES_API_KEY }` },
      // body: JSON.stringify({ "size": num, "query": {"function_score": { "functions": [{ "random_score": { "seed": Date.now() } }], "score_mode": "sum" } } }) 
      body: JSON.stringify({ "size": num, "query": { "function_score": { "query": { "match_all": {} }, "functions": [ { "random_score": {} } ] } } }) 
    })

  var data = await response.json()
  if(data && data.hits && data.hits.hits && data.hits.hits){
    return data.hits.hits.map( (hit) => hit._source )
  }
}
