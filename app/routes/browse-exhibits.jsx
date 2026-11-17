import BarTitle from "../components/BarTitle"
import { useLoaderData } from 'react-router'
import TVMenu from "../components/TVMenu"
import { exhibitToTVProgram } from "../utils/toTVProgram"
import { getExhibits, getFeatured } from "../utils/fetch"

export const loader = async () => {
  let exhibits = await getExhibits()
  let programs = []
  if(exhibits){
    programs = exhibits.map((exhibit) => exhibitToTVProgram(exhibit) )
  }

  let data
  data = {
    radio_and_tv: programs
  }

  return data
}

export default function Exhibits() {
  let data = useLoaderData()
  return (
    <div className="body-container">
        <a className="top-back-link-nav" href="/exhibits">&lt; Back to Exhibits</a>
      <BarTitle title="Browse All" />
      <TVMenu programs={ data.radio_and_tv } layout="grid" />
      </div>
  )
}

