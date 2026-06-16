import { useState, useEffect } from "react"
import { useNavigate, useLoaderData } from "react-router"
import LayoutSearch from "../components/LayoutSearch"
import TVMenu from "../components/TVMenu"
import { Home } from 'lucide-react'
import { exhibitToTVProgram, collectionToTVProgram } from "../utils/toTVProgram"
import { getCollections, getExhibits, getFeatured, getLatestBlogPosts } from "../utils/fetch"

export const loader = async () => {

  let collections = await getCollections()
  let featured_collections = await getFeatured()
  let exhibits = await getExhibits()
  let blog_posts = await getLatestBlogPosts()

  if(collections){
    collections = collections.map((collection) => collectionToTVProgram(collection) )
  }
  if(featured_collections){
    featured_collections = featured_collections.map((collection) => collectionToTVProgram(collection) )
  }
  if(exhibits) {
    exhibits = exhibits.map((exhibit) => exhibitToTVProgram(exhibit) )
  }

  let data = {
     radio_and_tv: collections,
     featured_collections: featured_collections,
     exhibits: exhibits,
     blog_posts: blog_posts,
     esIndex: process.env.ES_INDEX
   }

   return data
 }

export default function Index() {
  let data = useLoaderData()

  let navigateHook = useNavigate()
  const [search, setSearch] = useState("")
  const handleLayoutSearch = (val) => {
    setSearch(val)
  }

  let blog_posts
  if(data.blog_posts){
    blog_posts = data.blog_posts.map((post, i) => (
      <div key={i} className="blog-post-item">
        <span className="blog-post-date">
          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <h3 className="blog-post-title">
          <a href={post.link} target="_blank" rel="noreferrer"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}/>
        </h3>
      </div>
    ))
  }

  return (
    <>
      <div className="homepage-search">
        <h2>
          Discover historic programs of publicly funded radio and television across America. Watch and listen.
        </h2>
        <LayoutSearch
          esIndex={ data.esIndex }
          navigateHook={ navigateHook }
          handleChange={ handleLayoutSearch }
          searchQuery={ search }
          placeholder="Search by program, location, or topic"
        />
      </div>
      <div className='body-container'>
        <TVMenu title="Featured Collections" programs={data.featured_collections.slice(0, 3)} />
        <TVMenu title="Program Collections" programs={data.radio_and_tv.slice(0, 4)} seeAllURL="/collections" />
        <TVMenu title="Exhibits" programs={data.exhibits.slice(0, 4)} seeAllURL="/exhibits" />
        <TVMenu title="Stations and Organizations" programs={data.radio_and_tv.slice(0, 4)} seeAllURL="/collections" />
      </div>
      <div className="body-container">
        <a href="/organizations">
          <img src="/homepage-map.png" className="map-image" />
        </a>
        <a href="https://fixitplus.americanarchive.org/" target="_blank" rel="noopener noreferrer">
          <img src="/homepage-fixit.png" className="fixit-image" />
        </a>
        <div className="blog-posts-outer">
          <h2>Blog</h2>
          <div className="blog-posts-container">
            { blog_posts }
          </div>
        </div>
      </div>
    </>
  )
}
