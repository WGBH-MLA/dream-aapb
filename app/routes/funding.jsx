import { CircleCheckBig } from 'lucide-react'
import LayoutSearch from "../components/LayoutSearch"
import SummaryBox from "../components/SummaryBox"
import BigLink from "../components/BigLink"

export default function Funding() {
  return (
    <div className="page-container">
      <div className="skinny-body-container martop bmarbot static-logos">
        <h1 id="funding">Funding</h1>
        <p>The American Archive of Public Broadcasting is generously supported by the following organizations:</p>
        <h3 id="corporation-for-public-broadcasting">Corporation for Public Broadcasting</h3>
        <p className="marbot"><img src="https://s3.amazonaws.com/americanarchive.org/org-logos/cpb_logo.png" alt="CPB Logo Image"/> The Corporation for Public Broadcasting (CPB) promotes the growth and development of public media in communities throughout America. CPB provided funding for the American Archive Pilot Project, the American Archive Content Inventory Project, and the American Archive Digitization Project. Upon selecting GBH and the Library of Congress as the permanent stewards of the American Archive of Public Broadcasting, CPB awarded these organizations a two-year grant to complete the digitization project, accession and ingest the AAPB collection into the Library&#39;s systems, develop a website for public access, and develop policies for sustaining the initiative and growing the collection.</p>
        <h3 id="council-on-library-and-information-resources">Council on Library and Information Resources</h3>
        <p className="marbot"><img src="https://s3.amazonaws.com/americanarchive.org/org-logos/clir_logo.png" alt="CLIR Logo Image"/> The Council on Library and Information Resources (CLIR) awarded GBH in collaboration with the Library of Congress a Cataloging Hidden Special Collections and Archives grant to lead the National Educational Television (NET) Collection Catalog Project, the first project to build upon the American Archive of Public Broadcasting initiative. This project will involve the creation of a national catalog of records to provide robust descriptions of programs distributed by NET (1952-1972), comprising the earliest public television content.</p>
        <h3 id="institute-of-museum-and-library-services">Institute of Museum and Library Services</h3>
        <p className="marbot"><img src="https://s3.amazonaws.com/americanarchive.org/org-logos/imls_logo.png" alt="IMLS Logo Image"/> The Institute of Museum and Library Services is the primary source of federal support for the nation’s 123,000 libraries and 35,000 museums. Our mission is to inspire libraries and museums to advance innovation, lifelong learning, and cultural and civic engagement. Our grant making, policy development, and research help libraries and museums deliver valuable services that make it possible for communities and individuals to thrive.</p>
        <p className="marbot">The Laura Bush 21st Century Librarian Program supports projects to recruit and educate the next generation of librarians, faculty, and library leaders; and to support early career research. It also assists in the professional development of librarians and library staff.</p>
        <h3 id="the-andrew-w-mellon-foundation">The Andrew W. Mellon Foundation</h3>
        <p className="marbot"><img src="https://s3.amazonaws.com/americanarchive.org/org-logos/mellon_logo.png" alt="Mellon Logo Image" /> Founded in 1969, the Andrew W. Mellon Foundation endeavors to strengthen, promote, and, where necessary, defend the contributions of the humanities and the arts to human flourishing and to the well-being of diverse and democratic societies by supporting exemplary institutions of higher education and culture as they renew and provide access to an invaluable heritage of ambitious, path-breaking work. Additional information is available at <a href="https://www.mellon.org">www.mellon.org</a>.</p>
        <h3 id="national-endowment-for-the-humanities">National Endowment for the Humanities</h3>
        <p className="marbot"><img src="https://s3.amazonaws.com/americanarchive.org/org-logos/neh_logo.jpg" alt="NEH Logo Image"/> Created in 1965 as an independent federal agency, the National Endowment for the Humanities supports research and learning in history, literature, philosophy, and other areas of the humanities by funding selected, peer-reviewed proposals from around the nation. Additional information about the National Endowment for the Humanities and its grant programs is available at: www.neh.gov.</p>

      </div>

      <div className="skinny-body-container">
        <a className="back-link martop marbot" href="/about">&lt; Back To About the AAPB</a>
      </div>
    </div>
  )
}
