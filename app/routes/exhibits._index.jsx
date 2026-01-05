import { useLoaderData } from 'react-router'
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
import randomThumb from "../utils/randomThumb"
import randomRecords from "../utils/randomRecords"
import { exhibitToTVProgram } from "../utils/toTVProgram"
import { getExhibits } from "../utils/fetch"

export const loader = async () => {
  let exhibits
  exhibits = await getExhibits()
  let programs = []
  console.log( 'Eckuso', exhibits )
  if(exhibits){
    programs = exhibits.map((exhibit) => exhibitToTVProgram(exhibit) )
  }

  let data
  data = {
    exhibits: programs,
  }

  return data
}

export default function Index() {
  let data = useLoaderData()
  return (
    <div className='body-container'>
      <SummaryBox title="Scholarly Exhibits" text="American Archive of Public Broadcasting staff and guest curators create exhibits of selected recordings that focus on themes, topics, and events of cultural and historical significance." />
      
      <TVMenu title="" programs={ data.exhibits } />
    </div>
  )
}
