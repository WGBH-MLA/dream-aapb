import { useLoaderData } from '@remix-run/react'
// import shuffle from '~/utils/shuffle'
import LayoutSearch from "../components/LayoutSearch"
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
import randomThumb from "../util/randomThumb"

export const loader = async () => {
  let data = {
    featured_collections: [
      {
        title: "first things first",
        subtitle: "giuseppe open toe",
        thumbnail: randomThumb(),
        url: "google.com"
      },
      {
        title: "go back for seconds",
        subtitle: "round too",
        thumbnail: randomThumb(),
        url: "google.com"
      },
      {
        title: "third wheels motor club",
        subtitle: "vroom vroom",
        thumbnail: randomThumb(),
        url: "google.com"
      },
    ],

    radio_and_tv: [
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },

    ],

  }

  return data
}

export default function Index() {
  let data = useLoaderData()
  return (
    <div className='body-container'>

      <div className="homepage-search">
        <h2>
          Discover historic programs of publicly funded radio and television across America. Watch and listen.
        </h2>
        <LayoutSearch />
      </div>


      <TVMenu title="Featured Collections" programs={ data.featured_collections } seeAllURL="/collections" />
      <TVMenu title="Radio and Television Programs" programs={ data.radio_and_tv } seeAllURL="/collections" />
    </div>
  )
}
