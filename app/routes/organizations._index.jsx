import { useLoaderData } from '@remix-run/react'
// import VideoPlayer from "../components/VideoPlayer"
import HeaderBar from "../components/HeaderBar"
// import ShowBox from "../components/ShowBox"
// import { getRecord } from '../util/getRecord'
// import { niceTitle } from '../util/niceTitle'
import orgs from "../data/orgs.json"

export const loader = async ({params, request}) => {
  // let data = await getRecord(params.guid)
  let data = orgs



  if(data){
    return data
  } else {
    return null
  }
}

export default function Organizations() {
  const data = useLoaderData()
  return (
    <>
      <div className="skinny-body-container">
        <HeaderBar title="Participating Organizations" />

        <pre style={{ fontSize: "10px", display: "none" }}>
          {JSON.stringify(data, null, 20)}
        </pre>

        <div className="body-container">
        </div>
      </div>
    </>
  )
}

