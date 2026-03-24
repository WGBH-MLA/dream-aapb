import { CircleCheckBig } from 'lucide-react'
import LayoutSearch from "../components/LayoutSearch"
import SummaryBox from "../components/SummaryBox"
import BigLink from "../components/BigLink"
import LinkBankFooter from '../components/LinkBankFooter';

export default function Projects() {
  return (
    <div className="skinny-body-container">
      <a className="back-link-nav" href="/about">&lt; About the AAPB</a>
      <SummaryBox title="Projects" text="Our vision is to to preserve and make accessible significant historical content created by public media, and to coordinate a national effort to save at-risk public media before its content is lost to posterity. We're fulfilling our vision through several exciting grant projects." />
      <h3>The American Archive of Public Broadcasting: From Repository to Resource</h3>
      <p>In June 2019, The Andrew W. Mellon Foundation awarded GBH a grant to enhance usability of the American Archive of Public Broadcasting. The grant will support a two-pronged effort to make the AAPB a better resource for researchers, educators, academics and the public. The AAPB will work with Brandeis University’s Lab for Linguistics and Computation, which uses machine learning and artificial intelligence to develop open-source tools and workflows, to capture detailed metadata from AAPB radio and television programs. <a href="/about-the-american-archive/projects/mellon2">Read more about the Mellon project.</a>.</p>
      <h3>The Public Broadcasting Preservation Fellowship</h3>
      <p>The Public Broadcasting Preservation Fellowship (PBPF), funded by the Institute of Museum and Library Services, supports ten graduate student fellows at University of North Carolina, San Jose State University, Clayton State University, University of Missouri, and University of Oklahoma in digitizing at-risk materials at public media organizations around the country. Host sites include the Center for Asian American Media, Georgia Public Broadcasting, WUNC, the Oklahoma Educational Television Authority, and KOPN Community Radio. Contents digitized by the fellows will be preserved in the American Archive of Public Broadcasting. The grant also supports participating universities in developing long-term programs around audiovisual preservation and ongoing partnerships with their local public media stations. <a href="/about-the-american-archive/projects/pbpf">Read more about the PBPF project</a>.</p>
      <h3>The American Archive of Public Broadcasting</h3>
      <p>In June 2017, the Andrew W. Mellon Foundation awarded GBH a grant to support the American Archive of Public Broadcasting. GBH is using these grant funds to build technical capacity for the intake of new content, develop collaborative initiatives, build training and support services for AAPB contributors, and foster scholarly use and enhanced public access for the collection. <a href="/about-the-american-archive/projects/mellon">Read more about the Mellon project</a>.</p>
      <h3>PBCore Development and Training Project</h3>
      <p>In 2016, the National Endowment for the Humanities (NEH) awarded GBH a Preservation and Access Research and Development grant to pursue the PBCore Development and Training Project. Short for “Public Broadcasting Metadata Dictionary,” PBCore is a metadata schema – a standard for organizing information – for the management of public media and audiovisual collections in the United States. GBH will use the grant funds to develop tools, methodologies and training workshops to make PBCore more accessible to archivists and public media organizations over the course of this 27-month project. <a href="/about-the-american-archive/projects/pbcore">Read more about the PBCore Development and Training Project</a>.</p>
      <h3>PBS NewsHour Digitization Project</h3>
      <p>GBH, the Library of Congress, WETA, and NewsHour Productions, LLC are collaborating to digitize, preserve, and allow public access via the AAPB to 32 years of <em>PBS NewsHour</em>’s predecessor programs,
        including <em>The Robert MacNeil Report</em>, <em>The MacNeil/Lehrer Report</em>, <em>The MacNeil/Lehrer NewsHour</em>, and <em>The NewsHour with Jim Lehrer</em>. The project is generously funded by CLIR. <a href="/about-the-american-archive/projects/newshour"> Read more about the PBS NewsHour Digitization Project</a>.</p>
      <h3>Improving Access to Time-Based Media through Crowdsourcing and Machine Learning Project</h3>
      <p>Funded by the IMLS, GBH and Pop Up Archive are combining technological and social approaches for metadata creation
        by using computational tools and engaging the public through crowdsourcing games. <a href="/about-the-american-archive/projects/transcript-project"> Read more about the Crowdsourcing and Machine Learning Project</a>.</p>
      <h3>AAPB National Digital Stewardship Residency Project</h3>
      <p>In April of 2015, GBH was awarded a Laura Bush 21st Century grant by the Institute of Museum and Library Services (IMLS) to develop a National Digital Stewardship Residency program focused specifically on the area of digital audiovisual preservation in the realm of public media. <a href="/about-the-american-archive/projects/ndsr">Read more about the AAPB NDSR Project</a>.</p>
      <h3>National Educational Television (NET) Collection Catalog Project</h3>
      <p>The Council on Library and Information Resources (CLIR) awarded GBH and the Library of Congress a Cataloging Hidden Special Collections and Archives grant to lead the NET Collection Catalog Project. This project will involve the creation of a national catalog of records to provide robust descriptions of programs distributed by NET (1952-1972). <a href="/about-the-american-archive/projects/net-catalog">Read more about the NET Collection Catalog Project</a>.</p>
      <h3>American Archive Permanent Entity Grant</h3>
      <p>Funded by the Corporation for Public Broadcasting, this grant funded the development of the American Archive of Public Broadcasting through a collaboration between GBH and the Library of Congress. <a href="/about-the-american-archive/projects/permanent-entity"> Read more about the Permanent Entity Grant</a>.</p>
  <div className="link-bank">
        <a href="/our-story">Our Story</a>
        <hr />
        <a href="/vision-and-mission">Vision and Mission</a>
        <hr />
        <a href="/history">History</a>
      </div>
      <div className="link-bank">
            <a href="/council-and-committee">Council and Committee Members</a>
        <hr />
        <a href="/funding">Funding</a>
        <hr />
        <a href="/collaborators">Library and Education Collaborators</a>
      </div>
    </div>
  )
}
