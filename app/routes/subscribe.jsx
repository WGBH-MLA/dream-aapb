import { useState } from 'react'
import { useLoaderData } from '@remix-run/react'

import LayoutSearch from "../components/LayoutSearch"
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
import randomThumb from "../util/randomThumb"

export const loader = async () => {
  return null
}

export default function Subscribe() {
  let data = useLoaderData()
  const [email, setEmail] = useState(null)

  return (
    <>
      <div className="homepage-search">
        Please enter your email address to stay up to date with the latest AAPB news and events! 
        <div className="layout-search">
          <input type="text" placeholder="Email Address" onChange={ (e) => setEmail(e.target.value) }  />
          <button onClick={() => subscribe(email) }>Submit</button>
        </div>
       </div>
    </>
  )
}
