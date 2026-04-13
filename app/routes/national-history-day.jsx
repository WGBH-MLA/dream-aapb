import SummaryBox from "../components/SummaryBox"

export default function HistoryDay() {
  return (
    <div className="skinny-body-container marbot">
      <h1 className="marbot">National History Day</h1>
      <h2 className="marbot">Communication in History: The Key to Understanding</h2>
      <a className="floating-link" href="https://nhd.org" target="_blank" rel="noreferrer">
        <img
          src="https://s3.amazonaws.com/americanarchive.org/override/NHD_2021ThemeLogo_colorbg.png"
          alt="National History Day 2021 Theme Logo"
        />
      </a>
      <p>Each year, National History Day frames students’ research within a historical theme. The 2020-2021 theme is Communication in History: The Key to Understanding. National History Day (NHD) and students are exploring topics related to the ways that people have exchanged information throughout the past, how these methods and modes have changed over time, and how they have affected life today. Public broadcasting has been an influential form of communication for the past seven decades, and students can use the American Archive of Public Broadcasting (AAPB) to explore how public media has communicated important issues to the American public through television and radio. More than 55,000 programs from the late 1930s to the present day are streaming online, including interviews with leading political and cultural figures and ordinary people, national newscasts and news from diverse communities across the nation, revealing documentaries, and live coverage of events as they occurred.
      </p>
      <p>For more information on this theme, visit <a href="https://www.nhd.org/">National History Day</a>.
        To contact AAPB staff, email <a href="mailto:aapb_notifications@wgbh.org">aapb_notifications@wgbh.org</a></p>
      <p style={{ marginBottom: '3rem' }}></p>
      <h3 className="marbot">Online Reading Room Access (ORR)</h3>
      <p>More than 55,000 digitized historic programs are available in the AAPB <a href="https://americanarchive.org/catalog?q=&utf8=%E2%9C%93&f%5Baccess_types%5D%5B%5D=online">Online Reading Room (ORR)</a> for research, educational, and informational purposes.
      </p>
      <p style={{ marginBottom: '3rem' }}></p>
      <h3 className="marbot">Search Tips:</h3>
      <p>Use the search bar to search by keyword; use quotation marks to narrow searches to specific word phrases. <em>Example: Equal Rights Amendment without quotes will populate search results related to each individual word
        in the phrase, rather than populating results based on the specific sequence of words when quotes are applied, i.e.
        "Equal Rights Amendment"</em></p>
      <ul>
        <li>Available within the U.S. for research, educational and informational purposes (download not authorized)</li>
        <li>Use the search bar to search by keyword; use quotation marks to narrow searches to specific word phrases</li>
        <li>Example: Equal Rights Amendment without quotes will populate search results related to each individual word
          in the phrase, rather than populating results based on the specific sequence of words when quotes are applied,
          i.e. "Equal Rights Amendment”.</li>
        <li>Use the filters to narrow your search by media type, year(s), topic, genre, contributing organizations, etc.</li>
        <li>Sort by relevance, date (newest), date (oldest), or title</li>
      </ul>
      <p style={{ marginBottom: '3rem' }}></p>
      <figure className="captioned">
        <a href="https://americanarchive.org/exhibits/black-power" target="_blank" rel="noreferrer">
          <img
            src="https://s3.amazonaws.com/americanarchive.org/exhibits/black_power/b_greaves_and_house_option_2.png"
            alt="Black Journal hosts William Greaves and Lou House"
          />
        </a>
        <figcaption>
          Black Journal hosts William Greaves and Lou House from the Televising Black Politics in the Black Power Era exhibit.
        </figcaption>
      </figure>
      <h3 className="marbot">Additional Access Points</h3>
      <ul>
        <li>More than 50 <a href="https://americanarchive.org/special-collections">Special Collections</a> include summary information about the content, recommended search strategies,
          and related resources.</li>
        <li>Curated <a href="https://americanarchive.org/exhibits">exhibits</a> focus on ways public television and radio have covered issues and events of cultural and
          historical significance and provide accompanying essays that put the programs in relevant contexts.</li>
        <li>Limited Research Access (LRA) - Certain materials not available online are accessible via password-protected
          two-week access for bona fide research purposes. Reach out to <a href="mailto:aapb_notifications@wgbh.org">aapb_notifications@wgbh.org</a> for LRA requests.</li>
      </ul>
      <p style={{ marginBottom: '3rem' }}></p>
      <h2 className="marbot">Collections At a Glance</h2>
      <h3 className="marbot">Local History</h3>
      <p>The AAPB offers programming contributed by more than <a href="https://americanarchive.org/organizations" target="_blank" rel="noreferrer">130 organizations</a> across the country. Their materials include
        local programs, raw interviews, news reports, documentaries, newsmagazines, and more created over the past 70+ years.</p>

      <figure className="captioned">
        <a href="https://americanarchive.org/catalog/cpb-aacip-507-154dn40c26#at_682.533511_s" target="_blank" rel="noreferrer">
          <img
            src="https://s3.amazonaws.com/americanarchive.org/override/Judy_AIDS.png"
            alt="Coping With AIDS, episode headline from a 1985 episode of The MacNeil/Lehrer NewsHour."
          />
        </a>
        <figcaption>
          Coping With AIDS, episode headline from a 1985 episode of The MacNeil/Lehrer NewsHour.
        </figcaption>
      </figure>
      <p style={{ marginBottom: '3rem' }}></p>
      <h3 className="marbot">News Reports</h3>
      <ul>
        <li>Collections in the AAPB range from the late 1940s through the present, providing an audiovisual record of how
          national and international events have impacted communities on local and national levels.</li>
        <li>Suggested news collections in the AAPB include <a href="https://americanarchive.org/catalog?f%5Baccess_types%5D%5B%5D=online&f%5Bcontributing_organizations%5D%5B%5D=Pacifica+Radio+Archives+%28CA%29" target="_blank" rel="noreferrer">KPFA (Berkeley, CA)</a>, <a href="https://americanarchive.org/catalog?f%5Bseries_titles%5D%5B%5D=New+Jersey+Nightly+News&f%5Baccess_types%5D%5B%5D=online" target="_blank" rel="noreferrer">New Jersey Nightly News</a>,
          <a href="https://americanarchive.org/catalog?f%5Bseries_titles%5D%5B%5D=NewsNight+Minnesota&f%5Baccess_types%5D%5B%5D=online" target="_blank" rel="noreferrer"> NewsNight Minnesota</a>,
          or <a href="https://americanarchive.org/catalog?f%5Bseries_titles%5D%5B%5D=PBS+NewsHour&f%5Baccess_types%5D%5B%5D=online" target="_blank" rel="noreferrer">PBS NewsHour</a> collections.</li>
      </ul>
      <p style={{ marginBottom: '3rem' }}></p>
      <h3 className="marbot">Unedited Interviews</h3>
      <p>AAPB provides access to full-length accounts with historians and witnesses of historic events conducted for acclaimed series.
        See the <a href="https://americanarchive.org/special_collections/1964-interviews">1964 interviews</a>, <a href="https://americanarchive.org/special_collections/eotp-interviews">Eyes on the Prize Interviews</a>, <a href="https://americanarchive.org/special_collections/ken-burns-civil-war">Ken Burns' The Civil War Interviews</a>, or <a href="https://americanarchive.org/special_collections/the-murder-of-emmett-till-interviews">The Murder of Emmett Till Interviews</a>.</p>
      <p style={{ marginBottom: '3rem' }}></p>
      <h3 className="marbot">Historical Events</h3>
      <p>Watch and listen to coverage of the Watergate hearings, the AIDS crisis, civil rights and political movements, and more.
        See the <a href="https://americanarchive.org/special_collections/backstory">BackStory</a> collection, <a href="https://americanarchive.org/exhibits/civil-rights">Voices from the Southern Civil Rights Movement</a> exhibit, or the <a href="https://americanarchive.org/exhibits/conservatism" target="_blank" rel="noreferrer">On the Right: NET and
        Modern Conservatism </a>exhibit.</p>
      <p style={{ marginBottom: '3rem' }}></p>
      <figure className="captioned">
        <a href="https://americanarchive.org/catalog/cpb-aacip-516-t72794201n#at_1818.566075_s" target="_blank" rel="noreferrer">
          <img
            src="https://s3.amazonaws.com/americanarchive.org/override/NET_MrRogers.png"
            alt="Fred Rogers advocating for educational television in 1969."
          />
        </a>
        <figcaption>
          In an NET Special featuring the Public Television Hearings in 1969, Fred Rogers, star of "Mister Rogers' Neighborhood",
          successfully advocates for the government to financially support educational television.
        </figcaption>
      </figure>
      <h2 className="marbot">Example Topics and Suggested Content</h2>
      <p style={{ marginBottom: '3rem' }}></p>
      <h3 className="marbot">Understanding Public Broadcast History</h3>
      <ul>
        <li><a href="https://americanarchive.org/special_collections/net-catalog">National Educational Television collection</a></li>
        <li><a href="https://americanarchive.org/special_collections/newtonminow">Broadcasting in the Public Interest: The Newton Minow Collection</a></li>
        <li><a href="https://americanarchive.org/exhibits/station-histories">Documenting and Celebrating Public Broadcasting Histories </a>exhibit</li>
        <li><a href="https://americanarchive.org/special_collections/naeb">National Association of Educational Broadcasters Programs collection</a></li>
        <li><a href="https://americanarchive.org/exhibits/watergate">"Gavel-to-Gavel”: The Watergate Scandal and Public Television exhibit</a></li>
      </ul>
      <p style={{ marginBottom: '3rem' }}></p>
      <h3 className="marbot">Diversity in Broadcast Programs</h3>
      <ul>
        <li><a href= "https://americanarchive.org/special_collections/vegetable-soup">Vegetable Soup</a> collection</li>
        <li><a href="https://americanarchive.org/special_collections/outcasting">OutCasting</a> collection</li>
        <li><a href="https://americanarchive.org/special_collections/say-brother">Say Brother</a> collection</li>
      </ul>
      <figure className="captioned">
        <a href="https://americanarchive.org/special_collections/outcasting" target="_blank" rel="noreferrer">
          <img
            src="https://s3.amazonaws.com/americanarchive.org/override/OutCasting.png"
            alt="OutCasting public radio image."
          />
        </a>
        <figcaption>
          OutCasting is created by and for LGBTQ youth and straight allies, and is intended for a general listening audience
          that is open to learning about LGBTQ issues but may not know much about them.
        </figcaption>
      </figure>
      <p style={{ marginBottom: '3rem' }}></p>
      <h3 className="marbot">Women's Voices on Public Broadcasting</h3>
      <ul>
        <li><a href="https://americanarchive.org/special_collections/woman-series">Woman </a>series collection</li>
        <li><a href="https://americanarchive.org/catalog?f%5Bseries_titles%5D%5B%5D=Prospects+of+Mankind+with+Eleanor+Roosevelt&f%5Baccess_types%5D%5B%5D=online">Prospects of Mankind with Eleanor Roosevelt</a> series</li>
        <li><a href="https://americanarchive.org/special_collections/kopn-women">Feminist Community Radio at KOPN</a> collection</li>
      </ul>
      <p>Additional topics include legislation, religion, music, science, gender studies, education, immigration, and diaspora communities.
        For local content, visit the <a href="https://americanarchive.org/participating-orgs">AAPB Participating Organizations</a> landing page.</p>
      <p style={{ marginBottom: '3rem' }}></p>
      <h2 className="marbot">FAQ</h2>
      <p style={{ marginBottom: '3rem' }}></p>
      <h3 className="marbot">Can I download content?</h3>
      <p style={{ marginBottom: '3rem' }}></p>
      <p>Although content in the AAPB is available only for streaming online, AAPB staff can connect you with the producing station
        to request copies for your National History Day project.</p>
      <p style={{ marginBottom: '3rem' }}></p>
      <h3 className="marbot">How do I request access to materials not available online?</h3>
      <p style={{ marginBottom: '3rem' }}></p>
      <p>AAPB can provide you with password-protected access to certain materials via our Limited Research Access (LRA) Policy.</p>
      <p style={{ marginBottom: '3rem' }}></p>
      <h3 className="marbot">I need help in my research! How can I get in touch with the AAPB staff?</h3>
      <p style={{ marginBottom: '3rem' }}></p>
      <p>Contact us at <a href="mailto:aapb_notifications@wgbh.org">aapb_notifications@wgbh.org</a>.</p>
    </div >
  )
}