import { useLoaderData, useRouteError } from 'react-router'

export default async function randomRecords(num) {
  if (!num || num < 1) {
    throw 'that is just not an appropriate number okayyyyy??'
  }

  let esUrl = process.env.ES_URL || 'https://elastic.wgbh-mla.org'
  let esIndex = process.env.ES_INDEX_NAME || 'aapb_augmented_biggram'
  let esApiKey = process.env.ES_API_KEY

  var url = `${esUrl}/${esIndex}/_search`
  var response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(esApiKey ? { Authorization: `ApiKey ${esApiKey}` } : {}),
    },
    // body: JSON.stringify({ "size": num, "query": {"function_score": { "functions": [{ "random_score": { "seed": Date.now() } }], "score_mode": "sum" } } })
    body: JSON.stringify({
      size: num,
      query: {
        function_score: {
          query: { match_all: {} },
          functions: [{ random_score: {} }],
        },
      },
    }),
  })

  var data = await response.json()
  if (data && data.hits && data.hits.hits && data.hits.hits) {
    return data.hits.hits.map(hit => hit._source)
  }
}

export function ErrorBoundary() {
  const error = useRouteError()
  console.log('search error', error)
  return (
    <div className='page-body-container'>
      <h1>Search Error</h1>
      <h4>We're sorry! Search appears to be broken!</h4>
      <pre>{error.message}</pre>
    </div>
  )
}
