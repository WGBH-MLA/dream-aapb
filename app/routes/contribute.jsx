import { CircleCheckBig } from 'lucide-react'
import SummaryBox from "../components/SummaryBox"
import BigLink from "../components/BigLink"

export default function ContributeContent() {
  return (
<div className="skinny-body-container">
  <SummaryBox
    title="Opportunities to Preserve and Share Your Public Broadcasting Programming">
    <div className="marbot">
      The American Archive of Public Broadcasting (AAPB), a collaboration between the Library of Congress and GBH, preserves and provides access to historically significant public media from across the United States and its territories. Since 2013, the AAPB has archived <b>more than 300,000 programs</b> and records from <b>over 550 public broadcasting stations and producers</b>, helping safeguard at-risk audiovisual history for future generations.
    </div>
    <div className="marbot">
      Whether your materials are already digitized or still exist on physical media, we’d love to hear from you. We encourage stations to share both existing digital content and information about collections that may need preservation support and future digitization.
    </div>
  </SummaryBox>

      <h3>Submit Existing Digital Materials</h3>
        <p>Stations can contribute digitized public broadcasting content to the AAPB at no cost. No grant writing or complex application process is required.</p>
      <h3>Benefits of Participation include:</h3>
      <div className="contribute-list">
        <ul>
          <li>
            <CircleCheckBig color="#9e1d62" size={44} />
            <b>Greater discoverability -</b>Programs become part of a national public media archive with enhanced metadata, transcripts, and multiple levels of access for researchers, educators, archival producers, and the public.
          </li>
          <li>
            <CircleCheckBig color="#9e1d62" size={44} />
            <b>New opportunities for reuse -</b>Digitized content can be repurposed for broadcasts, documentaries, podcasts, educational initiatives, and community engagement.
          </li>
          <li>
            <CircleCheckBig color="#9e1d62" size={44} />
            <b>Long-term preservation -</b>Materials are preserved in partnership with the Library of Congress, helping safeguard your station's legacy for future generations.
          </li>
          <li>
            <CircleCheckBig color="#9e1d62" size={44} />
            <b>Your copyright remains intact -</b>The AAPB does not take ownership of contributed materials, and all licensing requests are directed back to your station.
          </li>
          <li>
            <CircleCheckBig color="#9e1d62" size={44} />
            <b>Expert support -</b>AAPB archivists provide guidance and project management assistance throughout the ingest and preservation process.
          </li>
        </ul>
      </div>

      <h3>Tell Us About Your Physical Collections</h3>
      <div className="marbot">
        Many stations still hold historically significant materials on tape, film, and other obsolete formats that are at risk of deterioration or loss. Even if your collections have not yet been digitized, we encourage you to share information about them with us.
      </div>
      <div className="marbot">
        By learning more about existing physical collections across the public broadcasting community, the AAPB can:
        </div>
         <li>identify preservation priorities,</li>
         <li>develop collaborative digitization initiatives,</li>
         <li>and pursue funding opportunities to help stations preserve vulnerable materials.</li>
      <div className="marbot">
        Your collection helps document important local histories, cultural programming, community voices, and public media achievements that deserve long-term preservation and access.
      </div>
      <div className="marbot">
        <b>Contact:</b> For any questions about working with the American Archive of Public Broadcasting you can email: <a href="mailto:aapb_submissions@wgbh.org">aapb_submissions@wgbh.org</a>
      </div>

      <hr />

      <h3>Learn More About the AAPB and the Digital Preservation Project</h3>

      <BigLink
        url="https://www.mellon.org/grant-story/reel-talk-saving-americas-public-media"
        title="Reel Talk: Saving America's Public Media Matters More Than You May Know"
        text="If these materials remain undigitized and are simply left to time, historians and archivists won't be the only ones who will lose."
      />

      <hr className="marbot" />

      <BigLink
        url="https://www.mellon.org/article/rescuing-the-nations-stories-one-tape-at-a-time"
        title="Rescuing the Nation's Stories One Tape at a Time"
        text="Though many don't realize it, a treasure trove of radio and television programs documenting our complex national history are stored in unofficial archives, trapped on obsolete recording formats that very few people can access."
      />
    </div>
  )
}
