import { useLoaderData } from '@remix-run/react'
// import shuffle from '~/utils/shuffle'
import LayoutSearch from "../components/LayoutSearch"
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
import randomThumb from "../util/randomThumb"

export const loader = async () => {
  return null
}

export default function Subscribe() {
  let data = useLoaderData()
  return (
    <>
      <div className="homepage-search">
        Please enter your email address to stay up to date with the latest AAPB news and events! 
        <input type="text" placeholder="Email Address"  />
        <input type="button" />
       </div>
    </>
  )
}
