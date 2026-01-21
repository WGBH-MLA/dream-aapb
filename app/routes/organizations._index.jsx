import { useLoaderData } from 'react-router'
import Mappy from "../components/Mappy"
import HeaderBar from "../components/HeaderBar"
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




        <div className="mappy-container marbot">
          <Mappy />
        </div>

      </div>
    </>
  )
}

