import { Italic } from "lucide-react"
import LayoutSearch from "../components/LayoutSearch"
import SummaryBox from "../components/SummaryBox"
import LinkBankFooter from '../components/LinkBankFooter';

export default function About() {
  return (
    <div className="skinny-body-container">
      <SummaryBox title="About the AAPB" text="The AAPB is an initiative to digitally preserve and make accessible public radio and television programming, ensuring its collection, management, preservation, and access." />
      <div className="welcome-video-container">
        <iframe src="https://player.vimeo.com/video/870294335?badge=0&autopause=0&player_id=0&app_id=58479"></iframe>
        <div className="martop">
          Watch a five minute introduction to the treasures of public broadcasting, written and produced by Elizabeth Deane.
        </div>
      </div>
      <LinkBankFooter />
    </div>
  )
}
