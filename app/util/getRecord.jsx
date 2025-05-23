export async function getRecord(guid){

  // curl -v -X GET 'localhost:9200/aapb_augmented/_search?q=guid:cpb-aacip-153-41mgqsz6' -H 'Authorization: ApiKey Z1pqdVE1VUJlMTdpbU5oSXNoby06SGtSZERqY0dSaHVpS2hvbVJnMEJwdw==' -H 'Content-Type: application/json'
  // var url = `${process.env.ES_URL}/${process.env.ES_INDEX_NAME}/_search?q=guid:${guid}`
  var url = `${process.env.ES_URL}/${process.env.ES_INDEX_NAME}/_search`
  console.log( 'yiikke!!!', url )
  var data = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "ApiKey Z1pqdVE1VUJlMTdpbU5oSXNoby06SGtSZERqY0dSaHVpS2hvbVJnMEJwdw==", body: { "query": {"match_phrase": { "guid": guid } } } } })
  return await data.json()
}