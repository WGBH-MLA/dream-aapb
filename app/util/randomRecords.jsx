// randomRecords.jsx
export default async function randomRecords(num) {
  if (!num || num < 1) {
    throw "that is just not an appropriate number okayyyyy??"
  }

  // ===== LOCAL DEV STUB =====
  if (process.env.NODE_ENV === "development") {
    return Array.from({ length: num }, (_, i) => ({
      title: `Demo Record ${i + 1}`,
      id: i + 1,
      description: "This is placeholder record for local layout"
    }))
  }

  // ===== REAL FETCH =====
  var url = `${process.env.ES_URL}/${process.env.ES_INDEX}/_search`
  var response = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `ApiKey ${process.env.ES_API_KEY}` 
    },
    body: JSON.stringify({
      size: num,
      query: {
        function_score: {
          query: { match_all: {} },
          functions: [{ random_score: {} }]
        }
      }
    })
  })

  var data = await response.json()
  if (data && data.hits && data.hits.hits) {
    return data.hits.hits.map((hit) => hit._source)
  }
}

