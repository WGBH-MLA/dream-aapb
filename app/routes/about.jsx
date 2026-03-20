import { Italic } from "lucide-react"
import LayoutSearch from "../components/LayoutSearch"
import SummaryBox from "../components/SummaryBox"
import LinkBankFooter from '../components/LinkBankFooter'

export default function About() {
  return (
    <div className="skinny-body-container">
      <SummaryBox title="About the AAPB" text="The AAPB is an initiative to preserve and make accessible public radio and television programming, ensuring its collection, management, and access." />
      <div className="welcome-video-container">
        <iframe src="https://player.vimeo.com/video/870294335?badge=0&autopause=0&player_id=0&app_id=58479" style={{width: '100%', height: '100%', border: 'none'}}></iframe>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
          Watch a five minute introduction to the treasures of public broadcasting, written and produced by Elizabeth Deane.
        </div>
      </div>
       <LinkBankFooter />
    </div>
  )
}
