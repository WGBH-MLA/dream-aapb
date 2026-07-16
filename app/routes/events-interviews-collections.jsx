import { useLoaderData } from 'react-router'
import TVMenu from "../components/TVMenu"
import { collectionToTVProgram } from "../utils/toTVProgram"
import { getCollections, getFeatured } from "../utils/fetch"

export const loader = async () => {
    let collections = await getCollections()
    let programs = []
    console.log( 'lecto', collections )
    if(collections){
        programs = collections.map((collection) => collectionToTVProgram(collection) )
    }

    let data
    data = {
        radio_and_tv: programs
    }

    return data
}

export default function Collections() {
    let data = useLoaderData()
    return (
        <div className="body-container">
        <h1>Historical Events and Interviews</h1>
        <TVMenu programs={ data.radio_and_tv }/>
        </div>
    )
}
