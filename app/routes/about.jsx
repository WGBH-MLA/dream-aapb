import LayoutSearch from "../components/LayoutSearch"
import SummaryBox from "../components/SummaryBox"

export default function About() {
  return (
    <div className="skinny-body-container">
      <SummaryBox title="About the AAPB" text="The AAPB is an initiative to preserve and make accessible public radio and television programming, ensuring its collection, management, and access." />
      <div className="welcome-video-container">
        <iframe src="https://player.vimeo.com/video/870294335?badge=0&autopause=0&player_id=0&app_id=58479" width="500" height="281"></iframe>
        <div>
          Watch a five minute introduction to the treasures of public broadcasting, written and produced by Elizabeth Deane.
        </div>
      </div>

      <div className="link-bank">
        <a href="/our-story">Our Story</a>
        <hr />
        <a href="/mission">Vision and Mission</a>
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
      </div>
    </div>
  )
}
