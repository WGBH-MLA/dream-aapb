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
          <iframe src="https://www.youtube.com/embed/naHLlt-nT98?si=Aip8ShMlqOGm9t3k" />
          <p>
            The American Archive of Public Broadcasting (AAPB), a collaboration between GBH and the Library of Congress, 
            invites you to explore the voices, events, and moments that have shaped our nation. 
            Through historic broadcasts, firsthand accounts, and cultural reflections, this collection 
            offers a unique window into America's past - its struggles, triumphs, and evolving identity.
          </p>
          <p>
            From groundbreaking political moments to the everyday experiences of communities across the country,
            these programs capture the spirit of the nation as told through public media organizations from the 
            1950s to today. Discover the stories that define America - then, now, and for the future.
          </p>
          <p>
            If this video inspires you, we hope you'll consider supporting our work to preserve these stories for future 
            generations: https://americanarchive.donorsupport....
          </p>
        </div>
        <LinkBankFooter />
      </div>
    </>
    
  )
}
