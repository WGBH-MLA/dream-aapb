export const hasQuoties = (query) => {
  return query && query.includes('\"')
}

export const extractQuotiesFromSearchbox = (query) => {
  var quoties = pullQuotedClauses(query)
  // remove quoted clauses from the query itself
  query = query.replace(/".*?"/g ,"")
  // console.log( 'I WANT MY QUOTIES', quoties, query )

  return {
    query: query, 
    quoties: quoties
  }
}

export const pullQuotedClauses = (query) =>{
  var result = []
  var rx = /".*?"/g
  var quoty
  while( quoty = rx.exec( query ) ) {
    if(quoty && quoty[0]){
      result.push(quoty[0].replace(/\"/g, ''))
    }
  }

  return result
}
