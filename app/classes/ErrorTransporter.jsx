import { ESTransporter } from 'searchkit'

export default class ErrorTransporter extends ESTransporter {
  constructor(esURL, esApiKey) {
    super()
    this.esURL = esURL
    this.esApiKey = esApiKey
  }

  async performNetworkRequest(requests) {
    let url = 'https://elastic.wgbh-mla.org/_msearch'
    console.log(
      'ErrorTransporter requests',
      requests,
      this.esURL,
      this.esApiKey,
      url
    )
    let response = fetch(url, {
      headers: {
        Authorization: `Bearer ${this.esApiKey}`,
      },
      body: this.createElasticsearchQueryFromRequest(requests),
      method: 'POST',
    })
      .then(res => res)
      .catch(err => {
        console.error('Elastic fetch error', err)
        throw new Response(`Elastic fetch error: ${err.message}`, {
          status: 500,
          statusText: 'Internal Elastic Error',
        })
      })
    return response
  }
}