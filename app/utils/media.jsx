export async function getCiToken(ciAPIHost, ciWorkspaceId, ciUser, ciPassword, ciClientId, ciClientSecret){
  // get a sony ci token
  var url = `${ciAPIHost}/oauth2/token`
  // encode username and password together for Basic Auth
  var encodedCreds = btoa(`${ciUser}:${ciPassword}`)
  var response = await fetch(url, { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${ encodedCreds }`
    },
    // deliver all the ci-related secrets in the body, grant_type required
    body: JSON.stringify({
      client_id: ciClientId,
      client_secret: ciClientSecret,
      grant_type: "password"
    })
  })

  var data = await response.json()
  if(data && data["access_token"]){
    return data["access_token"]
  } else {
    return false
  }
}

export async function getCiMediaURL(ciConfig){
  // get a sony ci video URL
  let ciToken = await getCiToken(ciConfig)

  // video then stream, audio then download
  let ciResource = isVideo ? `/assets/${ciRecordId}/streams` : `/assets/${ciRecordId}/download`

  let streamType = "hls"
  let params = {
    streams: [{
      name: `${ciRecordId}-stream`,
      expirationDate: new Date().toISOString()
    }]
  }

  if(ciToken){
    let resp = await ciRequest(ciAPIHost, ciResource, ciToken, params)
  } else {
    throw "Ci token was not found!"
  }
}

async function ciRequest(ciAPIHost, ciResource, ciToken, params){
  var url = `${esURL}/${ciResource}`
  if(!ciToken){
    throw "Missing Credentials!"
  }

  var response = await fetch(url, { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ ciToken }`
    },
    body: JSON.stringify(params) 
  })

  var data = await response.json()
  // return data
}
