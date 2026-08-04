import { useState } from 'react'
import { useLoaderData } from 'react-router'
import TVMenu from "../components/TVMenu"
import QuickPagination from "../components/QuickPagination"
import SummaryBox from "../components/SummaryBox"
import randomThumb from "../utils/randomThumb"
import randomRecords from "../utils/randomRecords"
import { exhibitToTVProgram } from "../utils/toTVProgram"
import { getExhibits } from "../utils/fetch"

export const loader = async () => {
  let data = await getExhibits("limit=9999&order=random")
  let exhibits = data.map((exhibit) => exhibitToTVProgram(exhibit))
  return exhibits
}

export default function Index() {
  let exhibits = useLoaderData()
  const [currentPage, setCurrentPage] = useState(0)

  var handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className='body-container'>
      <h1>Exhibits</h1>
      <p>American Archive of Public Broadcasting staff and guest curators create exhibits of selected recordings that focus on themes, topics, and events of cultural and historical significance.</p>

      <TVMenu title="" programs={exhibits} />
      <QuickPagination baseURL={"/exhibits"} currentPage={currentPage} handleChangePage={handleChangePage} />
    </div>
  )
}
