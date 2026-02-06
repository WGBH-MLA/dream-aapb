import LayoutSearch from "../components/LayoutSearch"
import SummaryBox from "../components/SummaryBox"

export default function ContactUs() {
  return (
    <div className="page-container">
      <div className="skinny-body-container">
        <SummaryBox title="Contact Us" text={ 'We would love to hear from you! If you have general questions or comments about the website and collection, or want to share information on the stories you find in the collection, you can reach us at <a href="mailto:aapb_notifications@wgbh.org">aapb_notifications@wgbh.org</a> or by mail.' } />
        
        <p><a href="/subscribe">Stay up to date with the AAPB by subscribing to our mailing list</a>.</p>
        <h3 className="smarbot">Library of Congress Mailing Address:</h3>
        <ul className="clean marbot">
          <li>Alan Gevinson</li>
          <li>Library of Congress</li>
          <li>Packard Campus for Audio Visual Conservation</li>
          <li>19053 Mt. Pony Rd.</li>
          <li>Culpeper, Virginia 22701-7551</li>
          </ul>
        <h3 className="smarbot">GBH Mailing Address:</h3>
        <ul className="clean marbot">
          <li>Karen Cariani</li>
          <li>WGBH Educational Foundation</li>
          <li>One Guest Street</li>
          <li>Boston, Massachusetts 02135</li>
        </ul>
      </div>
    </div>
  )
}
