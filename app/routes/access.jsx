import LinkBankFooter from '../components/LinkBankFooter';
import BarTitle from "../components/BarTitle"

export default function Access() {
  return (
    <div className="body-container">
      <a className="back-link-nav" href="/about">&lt; About the AAPB</a>
      <BarTitle title="Access" />

      <div className="skinny-body-container">
        <h2><b>On Location Research</b></h2><br />
        <p>
          Approximately 30% of the American Archive of Public Broadcasting (AAPB) collection is
          accessible anywhere in the United States through the Online Reading Room on the AAPB website. Members of
          the general public may access the entire collection within the GBH Archives offices and at the Library of Congress
          Moving Image and Recorded Sound Research Centers. Content is accessible as proxy files, or low-resolution
          viewing/listening copies provided through the AAPB website. Users accessing AAPB materials at the on-site research
          locations must agree to abide by AAPB Access Policies.
        </p>

        <h2><b>Visiting GBH</b></h2><br />
        <div className="marbot" style={{ display: "flex" }}>
          <img className="bmarleft" src='https://s3.amazonaws.com/americanarchive.org/on-location/wgbh-exterior.jpg' />
          <ul className="blank-list">
            <li><b>Hours and Location:</b></li>
            <li>8 am to 5 pm, Monday through Friday</li>
            <li>WGBH Educational Foundation</li>
            <li>GBH Archives</li>
            <li>One Guest Street</li>
            <li>Boston, MA 02135</li>
          </ul>
        </div>
        <p>
          Researchers must first schedule a research appointment with the GBH AAPB Project Manager, who can be contacted at <a href="mailto:aapb_notifications@wgbh.org">aapb_notifications@wgbh.org</a>. Researchers may visit anytime during normal business hours. Directions to GBH and additional information will be provided after a research appointment is scheduled. Researchers also will be asked to read, complete, and sign the GBH AAPB Access Policy.
        </p>
        <p>
          The Media Library and Archives will provide appropriate reference services and research space. All research and access to proxy files will be conducted in the Media Library and Archives. Researchers will use pencils or pens; no cameras or other recording devices are permitted. Copies of materials for scholarly use will be granted in accordance with the fair use provisions of the Copyright Act. The scholar must give a list of their copy requests to the AAPB Project Manager, and copies will be made by the Media Library and Archives staff. Scholars must provide their own storage device.
        </p>
        <p>
          The AAPB Collection must be acknowledged in publications as follows: [name of Contributing Organization], American Archive of Public Broadcasting (GBH and the Library of Congress), Boston, MA and Washington, DC. The Media Library and Archives will receive, free of charge, one copy of any paper, book, thesis, or article drawing substantially on materials from the AAPB.
        </p>


        <h2><b>Visiting the Library of Congress</b></h2><br />
        <p>The Library of Congress Motion Picture, Broadcasting and Recorded Sound Division contains two sections, Recorded Sound and Moving Image. These two sections have distinct policies and procedures regarding on-site access.
        </p>

        <h2><b>Recorded Sound Section</b></h2><br />
        <div className="marbot" style={{ display: "flex" }}>
          <img className="bmarleft" src='https://s3.amazonaws.com/americanarchive.org/on-location/library-exterior.jpg' />
          <ul className="blank-list">
            <li><b>Hours and Location:</b></li>
            <li>8:30 am to 5 pm, Monday through Friday</li>
            <li>Library of Congress</li>
            <li>101 Independence Ave. SE</li>
            <li>James Madison Building, LM 113</li>
            <li>Recorded Sound Research Center</li>
            <li>Performing Arts Reading Room</li>
            <li>Washington, DC 20540-4690</li>
          </ul>
        </div>
        <p>
          <b>Who Can Listen:</b><br />
          Recorded Sound collections are available to the public for listening in the Recorded Sound Research Center. Listening facilities are provided without charge.
        </p>

        <p>
          <b>Listening Appointments:</b><br />
          Recordings that fall under the rubric of the American Archive of Public Broadcasting Collection will be available for listening on demand, on-site at the Library.
        </p>
        <p>
          Appointments are required for listening to most of the other material in the Library’s collections. Recordings do not circulate. Listeners can telephone the Research Center at (202) 707-7833, fax requests to (202) 707-8464, or submit an email request to <a href="mailto:rsrc@loc.gov">rsrc@loc.gov</a>.
        </p>
        <p>
          The Library holds public media material other than the American Archive of Public Broadcasting Collection; these materials, if not already digitized, will take at least two weeks for engineers to digitize for listening appointments. Special arrangements are required for requests of more than five items needing digitization at one time. Certain audio formats will require more time to digitize and will necessitate a longer wait. Please contact the Research Center as soon as possible with large requests or to identify previously digitized recordings.
        </p>
        <p>
          Patrons may use the Research Center without appointment to access catalogs, in-house databases, reference books, archival manuscript collections, microfiche, microfilm, and other reference sources.
        </p>
        <p>
          Submitting Listening Requests: For listening requests of materials other than those in the American Archive Collection, be sure to include the name and title of the items requested, the call numbers (e.g., RWD 3214; LWO 5599 gr12 r2a1-3b), and your personal contact information so that we can confirm your appointment.
        </p>
        <p>
          Offsite researchers may begin their search by using the <a href="https://www.loc.gov/rr/record/">Recorded Sound Research Center site</a>, Library of Congress Online Catalog, or Sound Online Inventory and Catalog (SONIC). If unable to find a recording in the catalogs, please contact our reference staff by emailing <a href="mailto:rsrc@loc.gov">rsrc@loc.gov</a> or calling (202) 707-7833.
        </p>

        <h2><b>Moving Image Section</b></h2><br />
        <ul className="blank-list">
          <li><b>Hours and Location:</b></li>
          <li>8:30 am to 5:00 pm, Monday through Friday</li>
          <li>Library of Congress</li>
          <li>101 Independence Ave. SE</li>
          <li>James Madison Building, LM 336</li>
          <li>Moving Image Research Center</li>
          <li>Washington, D.C. 20540-4690</li>
        </ul>

        <p>
          <b>Who Can View:</b><br />
          Digital access copies of American Archive of Public Broadcasting Collection materials are available to the public for screening in the Moving Image Research Center.
        </p>
        <p>
          For materials in Library moving image collections other than those in the American Archive Collection, film, video, and digital access copies are available for screening by qualified researchers. Viewing facilities are provided without charge for individuals doing research that will lead to publicly available works, such as dissertations, publications, or film/television productions. University students with projects endorsed by their professors also qualify. We are unable to accommodate groups.
        </p>
        <p>
          <b>Viewing Appointments:</b><br />
          Advance notice and an appointment are required to view items in the AAPB that have been digitized. If an appointment needs to be cancelled or rescheduled, please contact the reference staff as soon as possible. Cancellation without sufficient notice can prevent others from having access to the facilities.
        </p>
        <p>
          <b>Submitting Viewing Requests:</b><br />

          For viewing requests of materials in the American Archive Collection, please provide title, call number (e.g. VBG 3214; FCA 4414-4416), and date. The Library holds public media material other than the American Archive of Public Broadcasting Collection; these materials, if not already digitized, will take at least two weeks for engineers to digitize for viewing appointments. Special arrangements are required for requests of more than five items needing digitization at one time. Certain video formats will require more time to digitize and will necessitate a longer wait. Please contact the Research Center as soon as possible with large requests or to identify previously digitized recordings.
        </p>
        <p>
          Offsite researchers may begin their search by using the <a href="https://www.loc.gov/rr/mopic/">Moving Image Research Center site</a> or Library of Congress Online Catalog. If unable to find a recording in the catalogs, please contact our reference staff by
          When submitting viewing requests for materials other than those in the American Archive collection, please provide title, call number (e.g. VBG 3214; FCA 4414-4416), and date.
        </p>
        <p>
          The Library holds public media material other than the American Archive of Public Broadcasting Collection. When an access copy does not exist for public media that is not in the American Archive Collection, researchers can contact a reference librarian to discuss the possibility of generating a digital access copy.
        </p>

        <h2><b>For Recorded Sound and Moving Image Collections</b></h2><br />

        <p>
          <b>Recording:</b><br />
          Recording equipment of any type is not allowed in the Research Centers. Photographing images from the screen for reference purposes will be permitted only when authorized in advance by our reference staff.
        </p>

        <p>
          <b>Reader Identification Card:</b><br />

          All users of the Library's research areas, including the Recorded Sound and Moving Image Research Centers, are required to have a Reader Identification Card issued by the Library.
        </p>
        <p>
          Reader Identification Cards are free and can be obtained by completing a registration process and presenting a valid driver's license, state-issued identification card, or passport. Researchers must be 16 and above years of age at time of registration.
        </p>
        <p>
          Readers may find more information about applying to be a Reader at the Library of Congress by navigating a web browser to: <a href="http://www.loc.gov/rr/readerregistration.html" target="_blank" rel="noopener noreferrer">http://www.loc.gov/rr/readerregistration.html</a>
        </p>
        <p>
          Though on-site registration is required, pre-registration may occur online, by following this URL: <a href="https://wwws.loc.gov/readerreg/remote/" target="_blank" rel="noopener noreferrer">https://wwws.loc.gov/readerreg/remote/</a>
        </p>
        <p>
          Researchers seeking access to the collection on-site may use this system to pre-register for a Library of Congress Reader Identification Card. In order to complete your registration and receive your card, researchers must come to the Library of Congress in person and present a valid form of identification at the Reader Registration Station located in the Madison Building, Room LM 133 (in the Newspaper & Current Periodicals Reading Room) or the Jefferson Building, Room LJ 139 (in the Microform and Electronic Resources Center).
        </p>


        <p><b>Maps and Floor Plans:</b><br />
          To facilitate applying for a card and reaching the reading room, please navigate to this URL: <a href="http://www.loc.gov/visit/maps-and-floor-plans/" target="_blank" rel="noopener noreferrer">http://www.loc.gov/visit/maps-and-floor-plans/</a>
        </p>

        <h2><b>Searching the AAPB Website</b></h2><br />
        <p>
          <b>General Search Tips</b>
        </p>
        <p>The AAPB website provides the general public with access to the AAPB Online Reading Room, where users can screen or listen to digitized materials that the AAPB has made available for research, educational and informational purposes. It also includes a database of the entire AAPB digitized collection, which currently includes 68,000 items (40,000 hours), and 2.5 million metadata recordings that describe items which have not yet been digitized. All of the records describe materials which have been inventoried, but not fully cataloged, and most contain only minimal information. The best way to find what you are looking for, or at least narrow your search on the AAPB website, is to conduct keyword searches in the search bar. Then, you can filter the retrieved results using the browsing options (facets) that appear on the left side of the search results page. You also can limit search results by inputting additional keyword search terms into the search box at the top of the screen that contains your initial search term. Using quotation marks around phrases (e.g., “civil rights”) will retrieve results in which that exact phrase appears in a record. If you come to the website not looking for anything in particular, check out the Browse the Collection section on the homepage for possible content to browse.</p>
        <p>If you type keywords into the search box, you will be searching all of the fields in all of the records in the Online Reading Room. Conducting a keyword search using the search box (as opposed to the Advanced Search option) is the most fail-safe way to search the collection because it will retrieve relevant results based on the data available, even if that data has not be entered into the correct field. </p>
        <p>
          <b>Limiting Your Search</b>
        </p>
        <p>
          From your search results, you can use additional facets on the left to filter your results.
        </p>
        <p>Using the <b>MEDIA TYPE</b> facet, you can filter your results to show only Moving Image or Sound.</p>
        <p>To filter your results based on their topic or format of the content use the <b>GENRE</b> or <b>TOPIC</b> facets: for example, Cooking, Arts, Nature, Talk Shows, and News Reports. Please note that not all records have been tagged with a Genre or Topic as cataloging is still in progress.</p>
        <p>The <b>ASSET TYPE</b> facet filters results based on whether they are Episodes, Clips, Programs, Raw Footage, etc. Please note that not all of the records have been assigned an Asset Type, as cataloging is still in progress.</p>
        <p>If you are looking for content contributed by a specific station or material from a specific state in the US, use the <b>ORGANIZATION</b> facet. With this facet you can filter your results based on which organization contributed the records to the AAPB collection, or based on the state in which the content originated. Clicking on a state will show all records contributed by all stations in that state.</p>
        <p>The <b>YEAR</b> facet lets you filter your results by a specific year or range of years. Please note that less than half of all records for digitized assets are currently dated, as cataloging is still in progress.</p>
        <p>
          <b>Expanding Your Search</b>
        </p>
        <p>To expand your search beyond content that is available in the Online Reading Room, click the "All Digitized" or "All Records" options under the Access filter in the facets menu that appears on the left side of the search results page. </p>
        <p>
          <b>Still have questions?</b>
        </p>
        <p>Check out our <a href="/faq" target="_blank" rel="noopener noreferrer">FAQ</a> page, and feel free to <a href="/contact" target="_blank" rel="noopener noreferrer">contact us</a>.</p>
      </div>
      <div className="skinnier-body-container">
        <LinkBankFooter />
      </div>
    </div>
  )
}