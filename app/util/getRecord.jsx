export async function getRecord(guid) {
  if (process.env.NODE_ENV === "development") {
    return {
      guid,
      title: `Demo Record ${guid}`,
      description: "Placeholder record for local layout",
      contributors: ["Demo Contributor"],
      date: "2026-01-22"
    }
  }

  const url = `${process.env.ES_URL}/${process.env.ES_INDEX}/_search`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `ApiKey ${process.env.ES_API_KEY}`
    },
    body: JSON.stringify({ query: { match_phrase: { guid } } })
  })

  const data = await response.json()
  if (data && data.hits && data.hits.hits && data.hits.hits[0]?._source) {
    return data.hits.hits[0]._source
  }

  return null
}

