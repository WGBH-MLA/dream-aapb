import LayoutSearch from "../components/LayoutSearch"
import BarTitle from "../components/BarTitle"
import HeaderBar from "../components/HeaderBar"

export default function About() {
    return (
      <div className="body-container">
        <BarTitle title="Volunteer" />
      <div className="skinny-body-container">
        <div>
            <p>Volunteer on your own schedule from your own home with Fix-It+. Fix-It+ allows you to follow 
                along and correct the computer-generated transcripts of programs in the American Archive of 
                Public Broadcasting, improving metadata and accessibility. Plus, it’s fun!</p>
            
            <p>For other volunteer opportunities, subscribe to our newsletter for upcoming events across 
                the country.</p>
            
            <p>Interested in hosting your own transcript-a-thon or sharing the AAPB with your community? 
                Reach out to GBH Archives Outreach Manager Meghan Sorensen at <a href="mailto:meghan_sorensen@wgbh.org">meghan_sorensen@wgbh.org</a>. 
                Our team is happy to provide trainings, presentations, materials, and outreach support.
                </p>
        </div> 
        </div>
        </div>
    )
  }
