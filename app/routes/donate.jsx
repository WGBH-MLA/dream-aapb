import LayoutSearch from "../components/LayoutSearch"
import SummaryBox from "../components/SummaryBox"

export default function Donate() {
  return (
    <div className="page-container">
      <div className="skinny-body-container">
        <SummaryBox title="Donate to the AAPB" text="The AAPB is an initiative to preserve and make accessible public radio and television programming, ensuring its collection, management, and access." />
        <h1 id="donate-to-the-aapb">Donate to the AAPB</h1>
        <p>Contribute to the <strong>American Archive of Public Broadcasting</strong> and help us provide access to our shared cultural heritage for years to come!</p>
        <p>A donation directly enables us to, among other things:</p>
        <ul>
        <li>Grow the amount of content available to the public in our Online Reading Room</li>
        <li>Improve our website with new features and improve functionality and discoverability of the collection</li>
        <li>Sustain AAPB technical infrastructure so that we can continue to provide online access to the collection</li>
        </ul>
        <p>Your donation will be made to GBH on behalf of the American Archive of Public Broadcasting. GBH is a 501(c)(3) nonprofit organization. All donations are tax deductible.</p>
        <p><a href="https://americanarchive.donorsupport.co/page/FUNUDUZQUXB" class="donate-button">Donate Now</a></p>
        <p>You can also send a donation by mail to:</p>
        <p>AAPB Donations<br/>
        c/o Karen Cariani<br/>
        GBH Archives<br/>
        WGBH Educational Foundation<br/>
        One Guest Street<br/>
        Boston, MA 02135</p>
        <p><a href="/about-the-american-archive/newsletter">Stay up to date with the AAPB by subscribing to our mailing list</a>.</p>

      </div>
    </div>
  )
}
