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
  let exhibits
  exhibits = await getExhibits()
  let programs = []
  console.log('Eckuso', exhibits)
  if (exhibits) {
    programs = exhibits.map((exhibit) => exhibitToTVProgram(exhibit))
  }

  let data
  data = {
    exhibits: programs,
  }

  return data
}

export default function Index() {
  let data = useLoaderData()
  const [currentPage, setCurrentPage] = useState(0)

  /* to do - decide if we should set pagination for exhibits */
  const PAGE_SIZE = 27
  const numPages = Math.ceil(data.exhibits.length / PAGE_SIZE)
  const pagedExhibits = data.exhibits.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  var handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className='body-container'>
      <h1>Scholarly Exhibits</h1>
      <p>American Archive of Public Broadcasting staff and guest curators create exhibits of selected recordings that focus on themes, topics, and events of cultural and historical significance.</p>

      <TVMenu title="" programs={pagedExhibits} classes="many" />
      <QuickPagination
        baseURL="/exhibits"
        currentPage={currentPage}
        numPages={numPages}
        handleChangePage={handleChangePage}
      />
    </div>
  )
}