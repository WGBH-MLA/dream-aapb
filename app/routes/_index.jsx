import { useState, useEffect } from "react"
import { useNavigate, useLoaderData } from "react-router"

import LayoutSearch from "../components/LayoutSearch"
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
import Mappy from "../components/Mappy"
import randomThumb from "../utils/randomThumb"
import randomRecords from "../utils/randomRecords"
import { recordToTVProgram } from "../utils/toTVProgram"

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

    esIndex: process.env.ES_INDEX || "hot-aapb",
  }

  return data
}

export default function Index() {
  let data = useLoaderData()
  
  let navigateHook = useNavigate()
  const [search, setSearch] = useState("")
  const handleLayoutSearch = (val) => {
    setSearch(val)
  }

  return (
    <>
      <div className="homepage-search">
        <h2>
          Discover historic programs of publicly funded radio and television across America. Watch and listen.
        </h2>
        <LayoutSearch
          esIndex={ data.esIndex }
          navigateHook={ navigateHook }
          handleChange={ handleLayoutSearch }
          searchQuery={ search }
        />
      </div>

      <div className="page-container">

        <div className="skinny-body-container">

          <div className="feature-video-container bmarbot">
            <iframe src="https://player.vimeo.com/video/870294335?badge=0&autopause=0&player_id=0&app_id=58479" width="1000" height="562"></iframe>
          </div>


          <div id="mappy" className="mappy-container marbot">
          <h2 className="marbot">Explore Stations Featured in the AAPB</h2>
            <Mappy />
          </div>

          <div className="marleft">
            <TVMenu title="Featured Collections" programs={ data.featured_collections } seeAllURL="/collections" />
            <TVMenu title="Radio and Television Programs" programs={ data.radio_and_tv } seeAllURL="/collections" />
          </div>
        </div>
      </div>
    </>
  )
}
