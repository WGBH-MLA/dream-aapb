import { useState } from 'react'
import { useLoaderData } from 'react-router'
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
import randomThumb from "../utils/randomThumb"
import randomRecords from "../utils/randomRecords"
import { exhibitToTVProgram } from "../utils/toTVProgram"
import { getExhibits } from "../utils/fetch"

export const loader = async () => {
  let radio_and_tv = await getExhibits("order=random")
  if (radio_and_tv) {
    radio_and_tv = radio_and_tv.map((exhibit) => exhibitToTVProgram(exhibit))
  }
  
  let data
  data = {
    radio_and_tv,
  }

  return data
}

export default function Exhibits() {
  let data = useLoaderData()
  return (
    <div className="body-container">
      <SummaryBox title="Exhibits" text="American Archive of Public Broadcasting staff and guest curators create exhibits of selected recordings that focus on themes, topics, and events of cultural and historical significance." />
        <TVMenu title="Featured Exhibits" programs={data.featured_exhibits} showDesc={true} />
        <TVMenu title="Stations and Organizations" programs={ data.radio_and_tv } seeAllURL="/stations-organizations-exhibits" />
        <TVMenu title="Programming and Formats" programs={ data.radio_and_tv } seeAllURL="/programming-formats-exhibits" />
        <TVMenu title="Historical Events and Interviews" programs={ data.radio_and_tv } seeAllURL="/historical-events-interviews-exhibits" />
        <TVMenu title="Topics and Themes" programs={ data.radio_and_tv } seeAllURL="/topics-themes-exhibits" />
        <TVMenu title="Browse All" programs={ data.radio_and_tv } seeAllURL="/browse-exhibits" />
      </div>
  )
}