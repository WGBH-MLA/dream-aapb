import BarTitle from "../components/BarTitle"
import PullQuote from "../components/PullQuote"
import LinkBankFooter from '../components/LinkBankFooter';

export default function History() {
  return (
    <>
      <div className="body-container">
        <a className="back-link-nav" href="/about">&lt; About the AAPB</a>
        <BarTitle title="Our History" />
        </div>

      <div className="skinnier-body-container">



        The American Archive of Public Broadcasting (AAPB) grew out of an initiative by the Corporation for Public Broadcasting (CPB) begun in 2007. Six years earlier, Congress had allocated funds to support PBS stations in the transition from analog to digital broadcasting. As the digital conversion deadline approached, many voiced concern about the fate of decades of public media programming recorded on analog formats which would soon be rendered unusable. Following lobbying efforts by the Association of Public Television Stations, Congress agreed to allow some of the funds it provided for the conversion to digital to be used to develop the American Archive. Over the next few years, the CPB developed the American Archive through a series of projects working in close collaboration with stations. These projects include:
        <p>
          <b>The American Archive Pilot Project (2009):</b> An initiative by the CPB, working with  Oregon Public Broadcasting, to identify, restore, and digitize nearly 2,500 hours of archival programming on the Southern Civil Rights Movement and the experiences of World War II veterans.
        </p>
        <p>
          <b>The American Archive Content Inventory Project (2010):</b> A project in which the CPB provided grants to 120 stations to inventory their physical media holdings.
        </p>
        <p>
          <b>PBCore 2.0 (2011):</b> The development of an updated metadata schema to serve as the archival standard for public media.
        </p>
        <p>
          <b>The American Archive Digitization Project (2012):</b> The digitization of 35,000 hours of programming on analog formats from 100 stations, and the cataloging and preservation of an additional 5,000 hours of digital programming.
        </p>

        <p>
          Following federal funding cuts, the CPB began the search for an outside institution to support and develop the American Archive. In 2013, it chose GBH and the Library of Congress to serve jointly as the permanent stewards of the American Archive, which subsequently became known as the American Archive of Public Broadcasting.
        </p>

        <p>Today, the AAPB contains programming from all fifty states and several major US territories, and it continues to grow. GBH and the Library of Congress share governance responsibilities and work collaboratively to achieve the AAPB’s mission to persevere and improve access to American public media’s archival record. </p>

        <p>For a more in-depth look at the AAPB’s history and the much longer history of efforts to preserve public media in the US, please see former AAPB Co-Director Alan Gevinson’s "A Brief History of the AAPB" (2015).</p>

        <LinkBankFooter />
      </div>
    </>
  )
} 