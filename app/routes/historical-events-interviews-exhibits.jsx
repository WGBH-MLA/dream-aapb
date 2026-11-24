import BarTitle from "../components/BarTitle"
import { useLoaderData } from 'react-router'
import TVMenu from "../components/TVMenu"
import { exhibitToTVProgram } from "../utils/toTVProgram"
import { getExhibits } from "../utils/fetch"

export const loader = async () => {
  let exhibits = await getExhibits()
  let programs = []
  if(exhibits){
    programs = exhibits.map((exhibit) => exhibitToTVProgram(exhibit) )
  }

  return {
    radio_and_tv: programs
  }
}

export default function Exhibits() {
  let data = useLoaderData()
  return (
    <div className="body-container">
      <a className="top-back-link-nav" href="/exhibits">&lt; Back to Exhibits</a>
      <BarTitle title="Historical Events and Interviews"/>
      <TVMenu programs={ data.radio_and_tv } layout="grid" />
    </div>
  )
}
