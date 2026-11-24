import SummaryBox from "../components/SummaryBox"
import { useLoaderData } from 'react-router'
import TVMenu from "../components/TVMenu"
import { collectionToTVProgram } from "../utils/toTVProgram"
import { getCollections, getFeatured } from "../utils/fetch"

export const loader = async () => {
  let collections = await getCollections("limit=9999")
  let featured = await getFeatured()
  let radio_and_tv = await getCollections("order=random")

  // console.log('lecto', collections)
  if (radio_and_tv) {
    radio_and_tv = radio_and_tv.map((collection) => collectionToTVProgram(collection))
  }
  if (featured) {
    featured = featured.map((collection) => collectionToTVProgram(collection))
  }

  let data
  data = {
    featured_collections: featured,
    collections,
    radio_and_tv,
  }

  return data
}

export default function Collections() {
  let data = useLoaderData()
  return (
    <div className="body-container">
      <SummaryBox title="Educator Resources" text="Leveraging the valuable digital media in the American Archive of Public Broadcasting, these Multimedia Primary Source Discussion Sets have been curated to support educators teaching topics in US History. They are intended for broad use in educational settings. By engaging with these digital resources, students will have the opportunity to observe connections between past and present-day events, grow in their understanding of multiple perspectives when considering present-day challenges, and exercise media literacy skills by examining sources for clues about the historical moment in which they were produced. These Multimedia Primary Source Discussion Sets were made possible by a grant from the Institute of Museum and Library Services [LG-250155-OLS-21]. " />
      <TVMenu title="Social Movements" programs={data.radio_and_tv} seeAllURL="/social-movements-resources"/>
      <TVMenu title="Historical Events" programs={data.radio_and_tv} seeAllURL="/events-resources"/>
      <TVMenu title="Political Economy" programs={data.radio_and_tv} seeAllURL="/political-economy-resources"/>
      <TVMenu title="Browse All" programs={data.radio_and_tv} seeAllURL="/browse-resources"/>
    </div>
  )
}
