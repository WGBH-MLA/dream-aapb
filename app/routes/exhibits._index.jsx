import { useLoaderData } from 'react-router'
// import shuffle from '~/utils/shuffle'
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
import randomThumb from "../utils/randomThumb"
import randomRecords from "../utils/randomRecords"
import recordToTVProgram from "../utils/recordToTVProgram"

export const loader = async () => {
  let records = await randomRecords(10)
  let programs = []
  if(records){
    programs = records.map((record) => recordToTVProgram(record) )
  }

  let data = {
    exhibits: programs
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
