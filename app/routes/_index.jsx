import { useLoaderData } from '@remix-run/react'
// import shuffle from '~/utils/shuffle'
import LayoutSearch from "../components/LayoutSearch"
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"

import randomThumb from "../util/randomThumb"
import randomRecords from "../util/randomRecords"
import recordToTVProgram from "../util/recordToTVProgram"

export const loader = async () => {

  let records = await randomRecords(1)
  let programs = records.map((record) => recordToTVProgram(record) )

  let data = {
    featured_collections: [
      {
        key: "coll1",
        title: "first things first",
        subtitle: "giuseppe open toe",
        thumbnail: randomThumb(),
        url: "google.com"
      },
      {
        key: "coll2",
        title: "go back for seconds",
        subtitle: "round too",
        thumbnail: randomThumb(),
        url: "google.com"
      },
      {
        key: "coll3",
        title: "third wheels motor club",
        subtitle: "vroom vroom",
        thumbnail: randomThumb(),
        url: "google.com"
      },
    ],

    radio_and_tv: programs,

    indexName: process.env.ES_INDEX_Name
  }


  return data
}

export default function Index() {
  let data = useLoaderData()
  return (
    <>
      <div className="homepage-search">
        <h2>
          Discover historic programs of publicly funded radio and television across America. Watch and listen.
        </h2>
        <LayoutSearch indexName={ data.indexName } />
      </div>

      <div className='body-container'>
        <TVMenu title="Featured Collections" programs={ data.featured_collections } seeAllURL="/collections" />
        <TVMenu title="Radio and Television Programs" programs={ data.radio_and_tv } seeAllURL="/collections" />
      </div>
    </>
  )
}
