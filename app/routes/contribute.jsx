import { CircleCheckBig } from 'lucide-react'
import BigLink from "../components/BigLink"
import BarTitle from "../components/BarTitle"

export default function ContributeContent() {
  return (
    <div className="body-container">
      <BarTitle title="Contribute Content" />

      <div className="skinny-body-container">
        <p><b>The American Archive of Public Broadcasting (AAPB)</b>, a collaboration between the Library of Congress and GBH, preserves and provides access to historically significant public media from across the United States and its territories. Since 2013, the AAPB has archived more than 300,000 programs and records from over 550 public broadcasting stations and producers, helping safeguard at-risk audiovisual history for future generations.</p>
        <p>Whether your materials are already digitized or still exist on physical media, we'd love to hear from you. We encourage stations to share both existing digital content and information about collections that may need preservation support and future digitization.</p>

        <b><p>Submit Existing Digitized Materials</p></b>
        <p>Stations can contribute digitized public broadcasting content to the AAPB at no cost. No grant writing or complex application process is required.</p>
        <p>By contributing your station's digitized content, you can help ensure that historically significant programming is preserved and made accessible to researchers, educators, and the public.</p>

        <p>Benefits of Participation include:</p>

        <div className="contribute-list">
          <ul>
            <li>
              <CircleCheckBig color="#9e1d62" size={44} />
              <span>
                <b>Greater discoverability - </b>Programs become part of a national public media archive with enhanced metadata, transcripts, and multiple levels of access for researchers, educators, archival producers, and the public.
              </span>
            </li>
            <li>
              <CircleCheckBig color="#9e1d62" size={44} />
              <span>
                <b>New opportunities for reuse - </b>Digitized content can be repurposed for broadcasts, documentaries, podcasts, educational initiatives, and community engagement.
              </span>
            </li>
            <li>
              <CircleCheckBig color="#9e1d62" size={44} />
              <span>
                <b>Long-term preservation - </b>Materials are preserved in partnership with the Library of Congress, helping safeguard your station's legacy for future generations.
              </span>
            </li>
            <li>
              <CircleCheckBig color="#9e1d62" size={44} />
              <span>
                <b>Your copyright remains intact - </b>The AAPB does not take ownership of contributed materials, and all licensing requests are directed back to your station.
              </span>
            </li>
            <li>
              <CircleCheckBig color="#9e1d62" size={44} />
              <span>
                <b>Expert support - </b>AAPB archivists provide guidance and project management assistance throughout the ingest and preservation process.
              </span>
            </li>
          </ul>
        </div>
        <p><b>Tell Us About Your Physical Collections</b></p>
        <p>
          Many stations still hold historically significant materials on tape, film, and other obsolete formats that are at risk of deterioration or loss. Even if your collections have not yet been digitized, we encourage you to share information about them with us.
        </p>
        <p>
          By learning more about existing physical collections across the public broadcasting community, the AAPB can:
        </p>
        <ul className="bullet-list">
          <li>identify preservation priorities</li>
          <li>develop collaborative digitization initiatives</li>
          <li>and pursue funding opportunities to help stations preserve vulnerable materials</li>
        </ul>
        <p>
          Your collection helps document important local histories, cultural programming, community voices, and public media achievements that deserve long-term preservation and access.
        </p>
        <p>
          <b>Contact:</b> For any questions about working with the American Archive of Public Broadcasting you can email: <a href="mailto:aapb_submissions@wgbh.org">aapb_submissions@wgbh.org</a>
        </p>

        <p><b>Learn More About the AAPB and the Digital Preservation Project</b></p>

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
    </div>

  )
}
