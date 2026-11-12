import LayoutSearch from "../components/LayoutSearch"
import BarTitle from "../components/BarTitle"
import LinkBankFooter from '../components/LinkBankFooter';
import HeaderBar from "../components/HeaderBar"
import { Link } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="body-container">
      <a className="back-link-nav" href="/about">&lt; About the AAPB</a>
      <BarTitle title="Contact Us" />
      <div className="skinnier-body-container">
        <div>
          <p>We want to hear from you!</p>

          <p>If you have general questions or comments about the AAPB, or want to share information on
            items you find in the collection, email our team at <a href="mailto:aapb_notifications@wgbh.org">aapb_notifications@wgbh.org</a>.</p>

          <p>If you’re interested in submitting materials from your organization to the American Archive
            of Public Broadcasting, please email <a href="mailto:aapb_submissions@wgbh.org">aapb_submissions@wgbh.org</a>.
          </p>

          <p>If you have press or partnership inquiries, please contact GBH Senior External Communications Manager Emily Balk at <a href="mailto:emily_balk@wgbh.org">emily_balk@wgbh.org</a> or GBH Archives Outreach Manager
            Meghan Sorensen at <a href="mailto:meghan_sorensen@wgbh.org">meghan_sorensen@wgbh.org</a>.
          </p>

          <p>
            <b>Library of Congress Mailing Address:</b><br />
            Rachel Curtis<br />
            Library of Congress<br />
            Packard Campus for Audio Visual Conservation<br />
            19053 Mt. Pony Rd.<br />
            Culpeper, Virginia 22701-7551
          </p>
          
          <p>
            <b>GBH Mailing Address:</b><br />
            Karen Cariani<br />
            WGBH Educational Foundation<br />
            One Guest Street<br />
            Boston, Massachusetts 02135<br />
          </p>
</div>
          <LinkBankFooter />
        </div>
      </div>
      )
  }
