import { CircleCheckBig } from 'lucide-react'
import LayoutSearch from "../components/LayoutSearch"
import SummaryBox from "../components/SummaryBox"

export default function Contribute() {
  return (
    <div className="skinny-body-container">
      <SummaryBox title="Contribute Content" text="The AAPB has received a generous Mellon Foundation grant to fund and support the digitization and preservation of publicly broadcast radio and television programs from producers and stations across the United States." />
      
      <h3>Digitize and Preserve Your Public Broadcasting Materials</h3>
      <div className="contribute-list">
        <ul>
          <li>
            <CircleCheckBig />
            <b>No cost and no grant writing required.</b> Participation is completely FREE. Digitization and shipping costs will be covered by the Mellon Foundation.
          </li>
          <li>
            <CircleCheckBig />
            <b>Your copyright remains intact.</b> AAPB does not take ownership of materials and directs all licensing requests to your station.
          </li>
          <li>
            <CircleCheckBig />
            <b>Rediscover classic programming</b> Once freed from physical formats, your past programs can be digitally repurposed for new productions, connecting with fresh audiences.
          </li>
          <li>
            <CircleCheckBig />
            <b>Expand your programming’s reach</b> Your programs will become part of a broader national project, making them even more discoverable to the American public through providing metadata, transcripts, and various levels of access.
          </li>
          
          <li>
            <CircleCheckBig />
            <b>Preserve your programming's legacy</b> Your programs will be safeguarded at the Library of Congress, ensuring that researchers and future generations can learn from and enjoy them.
          </li>
          
          <li>
            <CircleCheckBig />
            <b>Expert guidance</b> AAPB archivists provide project management support throughout the preservation process.
          </li>

        </ul>
      </div>

      <div className="blue-box">
        <h3>Digitization Submission Procedures</h3>

        The AAPB invites stations, producers, and archivists to submit their collections for the Mellon-funded Digital Preservation Project. To streamline the process, the AAPB has developed the following step-by-step guide:

        <b>
          <ol>
            <li>Submit a One-Sheet Summary of Materials</li>
            <li>Sign a Deed of Gift</li>
            <li>Create an Inventory</li>
            <li>Pack and Ship Tapes</li>
            <li>Receive Back Your Physical Media and Digital Files</li>
          </ol>
        </b>
      </div>

      <div className="marbot">
        <b>Contact:</b>
        For any questions about working with the American Archive of Public Broadcasting you can email: <a href="mailto:aapb_submissions@wgbh.org">aapb_submissions@wgbh.org</a>
      </div>

      <div className="marbot">
        <b>Submitting Digital Material:</b>
        The AAPB also welcomes pre-digitized and born-digital programming. Again, submitting your materials to the AAPB means they become even more discoverable and accessible to researchers, the public, and archival producers interested in licensing your content. They will also be preserved at the Library of Congress. To submit your digital programming, simply follow steps 1 - 3 above, then ship your materials to us on a hard drive. We can also explore transferring them through cloud-sharing services
      </div>

      <hr />

      <h3>Resources for Contributors</h3>
      <div>
        The <a href="/communications-toolkit">communications toolkit</a> guidelines help provide a template for spreading the word about your contribution to the AAPB and how your community can access historic programming from your organization.
      </div>
      <div>
        You may easily <a href="/obtain-metadata">obtain metadata</a> that describe the moving image and sound assets submitted to the AAPB by your organization through the Archival Management System (AMS).
      </div>
      <div>
        <a href="/resources">Additional Resources</a> can be found here.
      </div>

      <h3>Learn More About the AAPB and the Digital Preservation Project</h3>
      <div>
        In 2007, the Corporation for Public Broadcasting launched an initiative to develop a digital public broadcasting archive. The Library of Congress and GBH took over stewardship of the American Archive of Public Broadcasting in 2013 with the goal to preserve and make accessible significant historical content created by public media, and to coordinate a national effort to save at-risk public media before its content is lost to posterity. Since 2013, the AAPB has archived more than 190,000 items from more than 550 stations and producers.
      </div>



    </div>
  )
}
