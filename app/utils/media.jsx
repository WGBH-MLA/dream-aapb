export function getCiToken(ciAPIHost, ciUser, ciPassword){
  // get a sony ci token
  var url = `${ciAPIURL}/oauth2/token`
  var encodedCreds = btoa(`${ciUser}:${ciPassword}`)
  var response = await fetch(url, { 
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Basic ${esAPIKey}` }
  })

  // {
  //   "client_id": "yjtgrjdag8is4cxb",
  //   "client_secret": "q1h0jt4fi0bctwb5",
  //   "grant_type": "password"
  // }

  var data = await response.json()
  // return data
}

export function getCiMediaURL(){
  // get a sony ci video URL
}




async function ciRequest(ciAPIHost, ciResource, ciToken, params){
  var url = `${esURL}/${ciResource}`
  if(!ciToken){
    throw "Missing Credentials!"
  }

  var response = await fetch(url, { 
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Basic ${ ciToken }` },
  //   body: JSON.stringify(query) 
  })

  // var data = await response.json()
  // return data
}
