import { useLoaderData } from 'react-router'
// import shuffle from '~/utils/shuffle'
import LayoutSearch from "../components/LayoutSearch"
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
import Mappy from "../components/Mappy"

import randomThumb from "../util/randomThumb"
import randomRecords from "../util/randomRecords"
import recordToTVProgram from "../util/recordToTVProgram"

export const loader = async () => {

  let records = await randomRecords(10)
  let programs = []
  if(records){
    programs = records.map((record) => recordToTVProgram(record) )
  }

  let data = {
    featured_collections: [
      {
        key: "coll1",
        title: "Televising Black Politics in the Black Power Era: Black Journal and Soul!",
        subtitle: "",
        thumbnailURL: "https://s3.amazonaws.com/americanarchive.org/exhibits/black_power/b_greaves_and_house_option_2_cropped.png",
        url: "google.com"
      },
      {
        key: "coll2",
        title: "ZOOM (1972-1978): Children’s Community and Public Television in the 1970s",
        subtitle: "",
        thumbnailURL: "https://s3.amazonaws.com/americanarchive.org/exhibits/zoom/Zoom_mainimage.png",
        url: "google.com"
      },
      {
        key: "coll3",
        title: "Protecting Places: Historic Preservation and Public Broadcasting",
        subtitle: "",
        thumbnailURL: "https://s3.amazonaws.com/americanarchive.org/exhibits/pennstationcrop.jpg",
        url: "google.com"
      },
    ],

    radio_and_tv: programs,

    indexName: process.env.ES_INDEX_NAME
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

      <div className="feature-video-container marbot">
        <iframe src="https://player.vimeo.com/video/870294335?badge=0&autopause=0&player_id=0&app_id=58479" width="1000" height="562"></iframe>
      </div>

      <div className="mappy-container marbot">
        <Mappy />
      </div>

      <div className='body-container'>
        <TVMenu title="Featured Collections" programs={ data.featured_collections } seeAllURL="/collections" />
        <TVMenu title="Radio and Television Programs" programs={ data.radio_and_tv } seeAllURL="/collections" />
      </div>
    </>
  )
}
