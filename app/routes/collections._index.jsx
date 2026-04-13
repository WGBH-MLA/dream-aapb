import { useLoaderData } from 'react-router'
import shuffle from '../utils/shuffle'
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
import randomThumb from "../utils/randomThumb"
import randomRecords from "../utils/randomRecords"
import { collectionToTVProgram } from "../utils/toTVProgram"
import { getCollections, getFeatured } from "../utils/fetch"

export const loader = async () => {
  let collections = await getCollections()
  let featured = await getFeatured()
  let programs = []
  let proggys = []
  console.log( 'lecto', collections )
  if(collections){
    programs = collections.map((collection) => collectionToTVProgram(collection) )
  }
  if(featured){
    featured = featured.map((collection) => collectionToTVProgram(collection) )
  }


  let data
  data = {
    featured_collections: featured,
    radio_and_tv: programs
  }

  return data
}

export default function Collections() {
  let data = useLoaderData()
  return (
  <div className="body-container">
        <h1>Collections</h1>
        <p>The American Archive of Public Broadcasting contains more than 50,000 hours of digitized public broadcasting programs and original materials. Browse collections below.</p>
        <TVMenu title="Featured Collections" programs={ data.featured_collections } />
        <TVMenu title="Radio and Television Programs" programs={ data.radio_and_tv } />
      </div>
  )
}
