import { useLoaderData } from 'react-router'
import TVMenu from "../components/TVMenu"
import { collectionToTVProgram } from "../utils/toTVProgram"
import { getCollections, getFeatured } from "../utils/fetch"

export const loader = async () => {
  let collections = await getCollections("limit=9999")
  let featured = await getFeatured()
  let radio_and_tv = await getCollections("limit=4&order=random")

  console.log('lecto', collections)
  if (radio_and_tv) {
    radio_and_tv = radio_and_tv.map((collection) => collectionToTVProgram(collection))
  }
  if (featured) {
    featured = featured.map((collection) => collectionToTVProgram(collection))
  }

  let data
  data = {
    featured_collections: featured,
    collections,
    radio_and_tv,
  }

  return data
}

export default function Collections() {
  let data = useLoaderData()
  return (
    <div className="body-container">
      <h1>Collections</h1>
      <p>The American Archive of Public Broadcasting contains more than 50,000 hours of digitized public broadcasting programs and original materials. Browse collections below.</p>
      <TVMenu title="Featured Collections" programs={data.featured_collections} showDesc={true} />
      <TVMenu title="Program Collections" programs={data.radio_and_tv} seeAllURL="/program-collections"/>
      <TVMenu title="Stations and Organizations" programs={data.radio_and_tv} seeAllURL="/stations-organizations-collections"/>
      <TVMenu title="Historical Events and Interviews" programs={data.radio_and_tv} seeAllURL="/events-interviews-collections"/>
      <TVMenu title="Topics and Themes" programs={data.radio_and_tv} seeAllURL="/topics-themes-collections"/>
      <TVMenu title="Browse All" programs={data.radio_and_tv} seeAllURL="/browse-collections"/>
    </div>
  )
}
