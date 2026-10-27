import LayoutSearch from "../components/LayoutSearch"
import BarTitle from "../components/BarTitle"
import LinkBankFooter from '../components/LinkBankFooter';
import HeaderBar from "../components/HeaderBar"

export default function About() {
  return (
    <>
      <div className="body-container">
        <BarTitle title="About the AAPB" />
      </div>
      <div className="skinnier-body-container">
        <div>
          The AAPB is an initiative to digitally preserve and make accessible public radio and television programming, ensuring its collection, management, preservation, and access.
        </div>
        <div className="welcome-video-container">
          <iframe src="https://player.vimeo.com/video/870294335?badge=0&autopause=0&player_id=0&app_id=58479" />
          <p>Watch a five minute introduction to the treasures of public broadcasting, written and produced by Elizabeth Deane.</p>
        </div>
        <LinkBankFooter />
      </div>
    </>
    
  )
}
