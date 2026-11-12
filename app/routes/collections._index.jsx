import SummaryBox from "../components/SummaryBox"
import BarTitle from "../components/BarTitle"
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
  <SummaryBox title="Collections">
    <p>
      The American Archive of Public Broadcasting contains more than 300,000
      digitized radio and television programs and ancillary broadcast materials.
      Some of these items have been curated into special collections organized
      into five broad categories: <a href="/featured-collections">Featured Collections</a>, <a href="/stations-organizations-collections">Stations and Organizations</a>, <a href="/program-collections">Programs</a>, <a href="/events-interviews-collections">Historical Events and Interviews</a>, and <a href="/topics-themes-collections">Topics and Themes</a>.
    </p>
    <p>
      Explore programming from specific <a href="/stations-organizations-collections">Stations and Organizations</a>, such as
      Pacifica Radio Archives and GBH; watch some of our most noteworthy  <a href="/program-collections">Programs</a> and <a href="/events-interviews-collections">Interviews</a> from landmark documentaries, like Eyes on the
      Prize; view materials organized around <a href="/topics-themes-collections">Topics</a>, such as Hispanic Heritage
      and the American Bicentennial; and check out our rotating list of <a href="/featured-collections">featured</a>
      collections. Most of the materials in special collections are available
      online; however some items can only be accessed on site at GBH or the
      Library of Congress, or through remote research access. Email us at{" "}
      <a href="mailto:aapb_notifications@wgbh.org">aapb_notifications@wgbh.org</a>{" "}
      to learn more.
    </p>
  </SummaryBox>
      <TVMenu title="Featured Collections" programs={data.featured_collections} showDesc={true} />
      <TVMenu title="Program Collections" programs={data.radio_and_tv} seeAllURL="/program-collections"/>
      <TVMenu title="Stations and Organizations" programs={data.radio_and_tv} seeAllURL="/stations-organizations-collections"/>
      <TVMenu title="Historical Events and Interviews" programs={data.radio_and_tv} seeAllURL="/events-interviews-collections"/>
      <TVMenu title="Topics and Themes" programs={data.radio_and_tv} seeAllURL="/topics-themes-collections"/>
      <TVMenu title="Browse All" programs={data.radio_and_tv} seeAllURL="/browse-collections"/>
    </div>
  )
}
