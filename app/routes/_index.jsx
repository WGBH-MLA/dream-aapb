import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useLoaderData } from "react-router"

import LayoutSearch from "../components/LayoutSearch"
import HomepageHeader from "../components/HomepageHeader"
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
import randomThumb from "../utils/randomThumb"
import randomRecords from "../utils/randomRecords"
import { recordToTVProgram } from "../utils/toTVProgram"
import { Home } from 'lucide-react'

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
  const [block, setBlockMapZoom] = useState("")

  const handleLayoutSearch = (val) => {
    setSearch(val)
  }

  // useEffect(() => {
  //   window.addEventListener('scroll', () => {
  //     document.getElementById("mappy").style.overflow = "hidden"

  //     setTimeout(() => {
  //       document.getElementById("mappy").style.overflow = "inherit"
  //     }, 100)
  //   })
  // }, [])

  return (
    <>
    <HomepageHeader esIndex={data.esIndex} />
      <div className="homepage-search">
        <h2>
          Discover historic programs of publicly funded radio and television across America. Watch and listen.
        </h2>
        <LayoutSearch
          esIndex={ data.esIndex }
          navigateHook={ navigateHook }
          handleChange={ handleLayoutSearch }
          searchQuery={ search }
          placeholder="Search by program, location, or topic"
        />
      </div>
      <div className='body-container'>
        <TVMenu title="Featured Collections" programs={data.featured_collections} />
        <TVMenu title="Radio and Television Programs" programs={data.radio_and_tv} seeAllURL="/collections" />
        <TVMenu title="Historical Events and Interviews" programs={data.radio_and_tv} seeAllURL="/collections" />
        <TVMenu title="Stations and Organizations" programs={data.radio_and_tv} seeAllURL="/collections" />
      </div>
      <div className="body-container">
        <a href="/organizations" style={{ textDecoration: 'none' }}>
          <img src="/homepage-map.png" className="map-image" />
        </a>
        <a href="https://fixitplus.americanarchive.org/" target="_blank" rel="noopener noreferrer">
          <img src="/homepage-fixit.png" className="fixit-image" />
        </a>
      </div>
    </>
  )
}
