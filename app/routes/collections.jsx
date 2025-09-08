import { useLoaderData } from '@remix-run/react'
// import shuffle from '~/utils/shuffle'
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
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
        title: "first things first",
        subtitle: "giuseppe open toe",
        thumbnailURL: randomThumb(),
        url: "google.com"
      },
      {
        title: "go back for seconds",
        subtitle: "round too",
        thumbnailURL: randomThumb(),
        url: "google.com"
      },
      {
        title: "third wheels motor club",
        subtitle: "vroom vroom",
        thumbnailURL: randomThumb(),
        url: "google.com"
      },
    ],

    radio_and_tv: programs

  }

  return data
}

export default function Index() {
  let data = useLoaderData()
  return (
    <div className='body-container'>
      <SummaryBox title="Collections" text="The American Archive of Public Broadcasting contains more than 50,000 hours of digitized public broadcasting programs and original materials. Browse collections below." />
      
      <TVMenu title="Featured Collections" programs={ data.featured_collections } seeAllURL="/collections" />
      <TVMenu title="Radio and Television Programs" programs={ data.radio_and_tv } seeAllURL="/collections" />
    </div>
  )
}
