import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useLoaderData } from "react-router"
import LayoutSearch from "../components/LayoutSearch"
import HomepageHeader from "../components/HomepageHeader"
import TVMenu from "../components/TVMenu"
import { recordToTVProgram } from "../utils/toTVProgram"
import { Home } from 'lucide-react'
import { collectionToTVProgram } from "../utils/toTVProgram"
import { getCollections, getFeatured } from "../utils/fetch"
import { getExhibits } from "../utils/fetch"

export const loader = async () => {

  let collections = await getCollections()
  let featured = await getFeatured()
  let exhibits = await getExhibits()
  let programs = []
   let proggys = []
   console.log( 'lecto', collections )
   if(collections){
     programs = collections.map((collection) => collectionToTVProgram(collection) )
   }
   if(featured){
     featured = featured.map((collection) => collectionToTVProgram(collection)
    )
    if(exhibits) {
      exhibits = exhibits.map((exhibit) => recordToTVProgram(exhibit))
    }
   }
  let data
   data = {
     featured_collections: featured,
     radio_and_tv: programs,
     exhibits: exhibits
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
        <TVMenu title="Featured Collections" programs={data.featured_collections.slice(0, 3)} />
        <TVMenu title="Radio and Television Programs" programs={data.radio_and_tv.slice(0, 4)} seeAllURL="/collections" />
        <TVMenu title="Scholarly Exhibits" programs={data.exhibits.slice(0, 4)} seeAllURL="/exhibits" />
        <TVMenu title="Stations and Organizations" programs={data.radio_and_tv.slice(0, 4)} seeAllURL="/collections" />
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
