import { Italic } from "lucide-react"
import LayoutSearch from "../components/LayoutSearch"
import SummaryBox from "../components/SummaryBox"

export default function About() {
  return (
    <div className="skinny-body-container">
      <SummaryBox title="About the AAPB" text="The AAPB is an initiative to digitally preserve and make accessible public radio and television programming, ensuring its collection, management, preservation, and access." />
      <div className="welcome-video-container">
        <iframe src="https://player.vimeo.com/video/870294335?badge=0&autopause=0&player_id=0&app_id=58479" style={{width: '100%', height: '100%', border: 'none'}}></iframe>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
          Watch a five minute introduction to the treasures of public broadcasting, written and produced by Elizabeth Deane.
      </div>
      </div>
      <>
      <div className="link-bank">
        <a href="/our-story">Our Story</a>
        <hr />
        <a href="/vision-and-mission">Vision and Mission</a>
        <hr />
        <a href="/history">History</a>
        <hr />
        <a href="/council-and-committee">Council and Committee Members</a>
      </div>
      <div className="link-bank">
        <a href="/projects">Projects</a>
        <hr />
        <a href="/funding">Funding</a>
        <hr />
        <a href="/collaborators">Library and Education Collaborators</a>
             <hr />
      </div>
    </>
    </div>
  )
}
