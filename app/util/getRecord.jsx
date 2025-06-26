export async function getRecord(guid){
  var url = `${process.env.ES_URL}/${process.env.ES_INDEX_NAME}/_search`
  var response = await fetch(url, { 
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "ApiKey Z1pqdVE1VUJlMTdpbU5oSXNoby06SGtSZERqY0dSaHVpS2hvbVJnMEJwdw==" },
      body: JSON.stringify({ "query": {"match_phrase": { "guid": guid } } }) 
    })

  return await response.json()
}
