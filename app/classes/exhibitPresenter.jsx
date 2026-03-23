import { decode } from "html-entities"
import { useEffect } from "react"
import { renderBlocks } from "./contentHelpers"
import Author from "../components/Author"
import InvitingSidebar from "../components/InvitingSidebar"

export function renderExhibit(exhibit) {
  let blocks = renderBlocks(exhibit.body)

  let authorsBlock
  let authors = exhibit.authors.map( (author, i) => <Author key={i} name={ author.name } imgURL={ author.image.url } bio={ author.bio } /> )
  if(authors.length > 0){
    authorsBlock = (
      <>
        <h2 className="smarbot">Authors</h2>
        <div className="authors-container">
          { authors }
        </div>
      </>
    )
  }

  useEffect(() => {
    // fixLinks()
  }, [])


  let titleURL, titleText
  // hack, doesnt work for top level pages
  if(exhibit.meta.parent.title !== "AAPB"){
    titleURL = exhibit.meta.parent.meta.html_url.replace("http://aapb/", "/exhibits/") 
    titleText = exhibit.meta.parent.title
  } else {
    titleURL = exhibit.meta.html_url
    titleText = exhibit.title
  }

  return (
    <div>

      <div className="page-container">
        <div className="sidey-container">
          {/* todo: corrected exhibit main page link */}
          <InvitingSidebar titleText={ titleText } titleURL={ titleURL } links={ exhibit.sections } />

          <div className="sidey-body marleft">
            <div className="sidey-body-container exhibit-title marbot">
              <div className="exhibit-top-slice-container"></div>
              <div className="exhibit-top-container">
                <h2>
                  { exhibit.title }
                </h2>
                <img src={ exhibit.cover_image.full_url } />
              </div>

              <div className="exhibit-top-back-link-container">
                <a className="exhibit-top-back-link" href="/exhibits">&lt; Back To Exhibits</a>
              </div>
            </div>

            <div className="sidey-body-container">
              <div className="page-body">
                { blocks }
              </div>
            </div>

            <div className="sidey-body-container">
              { authorsBlock }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// function fixLinks(){
//   var links = document.querySelectorAll('a')
//   links.forEach((link) => {
//     if(link.pathname.startsWith("/exhibits/")){
//       link.pathname = link.pathname.replace(/.md$/, '').replace(/^\/exhibits\/.*\//, '/exhibits/')
//     }
//   })
// }

// copied from OV front
export function renderSidebarSection(title, id, key) {
  return (
    <div key={key} className='page-sidebar-link'>
      <a
        onClick={() => {
          scrollSectionIntoView(id)
        }}
        dangerouslySetInnerHTML={{ __html: decode(title) }}
      />
    </div>
  )
}

function scrollSectionIntoView(sectionId) {
  let ele = document.getElementById(sectionId)
  ele.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
}

function scrollToAnchor(anchorId) {
  // erase backbutton entry for anchor click
  // location.replace(document.referrer)

  let ele = document.getElementById(anchorId)

  // where we goin
  var destination = ele.getBoundingClientRect().y
  // where ah we
  var currentScrollPosition = window.scrollY

  // just a little extra
  var offset = -96

  // alright bye bye
  window.scrollTo({
    top: destination + currentScrollPosition + offset,
    behavior: 'smooth',
  })
}
