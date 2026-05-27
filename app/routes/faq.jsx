import LinkBankFooter from '../components/LinkBankFooter';
import { useState } from "react";

const faqs = [
  {
    q: "What is the American Archive of Public Broadcasting (AAPB)?",
    a: (
      <>
        <p>The American Archive of Public Broadcasting (AAPB) is a national initiative to preserve and provide access to public radio and television programming. Its work includes the collection, digitization, management, and long-term preservation of public media.</p>
        <p>In August 2013, the Corporation for Public Broadcasting selected GBH and the Library of Congress as the permanent stewards of the AAPB collection.</p>
        <p>To date, more than 300,000 historic public broadcasting programs and original materials have been digitized and preserved. The AAPB provides free online access to over one-third of this content. The full collection is available for on-site research at GBH and the Library of Congress. In addition, the AAPB maintains metadata records describing more than 2.5 million public broadcasting assets held by organizations across the United States, most of which have not yet been digitized.</p>
      </>
    ),
  },
  {
    q: "What is available on the AAPB website?",
    a: (
      <>
        <p>The AAPB website provides free online access to more than 100,000 radio and television programs for research, educational, and informational use.</p>
        <p>Users can also search across more than 2.5 million metadata records, which include:</p>
        <ul>
          <li>digitized items available online</li>
          <li>digitized items accessible only on-site at GBH or the Library of Congress</li>
          <li>materials held by public media organizations nationwide, many of which have not yet been digitized</li>
        </ul>
        <p>In addition to individual programs, the site features curated exhibits on historically significant topics, special collections highlighting notable content from the archive, and multimedia primary resource sets designed for classroom use.</p>
      </>
    ),
  },
  {
    q: "How can I tell if something in the AAPB has been digitized?",
    a: (
       <>
      <p>After searching the AAPB website, select the “All Digitized” filter below the “Search Records” bar. This will show all digitized items, including those only available on-site at GBH and the Library of Congress.</p>
    </>
    ),
  },
  {
    q: "How can I conduct research using the entire AAPB collection?",
    a: (
      <>
      <p>The full digitized AAPB collection is available for on-site research at GBH in Boston and the Library of Congress in Washington, D.C. More information about on-location research policies and scheduling an appointment is available here.</p>
      </>
      ),
  },
  {
    q: "Will more content be available online in the future?",
    a: (
      <>
      <p>AAPB staff continue to review digitized content and make more material available online. If you find something that has been digitized but is not yet available, you can contact us and we will try to prioritize its review.</p>
    </>
    ),
  },
  {
    q: "Can I access collection material that is not available online?",
    a: (
      <>
        <p>Not all AAPB collection material is available online due to rights and other legal restrictions. However, the full collection can be accessed on-site at GBH and the Library of Congress.</p>
        <p>Not all AAPB collection material is available online due to rights and other legal restrictions. However, the full collection can be accessed on-site at GBH and the Library of Congress.</p>
        <p>In some cases, you may request limited remote access to materials for bona fide research and scholarly purposes. To do so, contact us at aapb_notifications@wgbh.org</p>
        <p>AAPB staff will make every effort to respond within three (3) business days, though response times may vary, and not all materials are eligible. If approved, you will receive secure access via a unique URL and password.</p>
      </>
    ),
  },
  {
    q: "Since it’s public media, isn’t it in the public domain?",
    a: (
      <>
      <p>No. Many materials in the AAPB are protected by U.S. copyright law, and use may require permission from copyright holders, creators, performers, unions, or other rights holders. Privacy and publicity rights may also apply.</p>
      <p>Because of the nature of public media, copyright status can sometimes be difficult to determine. When possible, the AAPB provides rights information in catalog records and related materials to help users assess how content may be used.</p>
    </>
    ),
  },
  {
    q: "If I would like to license or reuse content in the archive, whom do I contact?",
    a: (
      <>
<p>It is your responsibility to determine and satisfy any copyright and other use restrictions before using AAPB content.</p>
<p>If you identify an item you would like to license or reuse, contact the contributing organization listed in the item’s metadata record. Each organization’s page includes a website URL to help you get in touch.</p>
</>
),
  },
  {
    q: "If I find an item that hasn’t been digitized, how can I access it?",
    a: (
      <>
<p>If an item has not been digitized, you can contact the contributing organization listed in the metadata record to learn whether and how it may be accessed.</p>
</>
),
  },
  {
    q: "What should I do if I have concerns about a metadata record or transcript?",
    a: (
      <>
        <p>The AAPB works to make its collections accessible through metadata and transcripts, but with a large and diverse archive, errors and gaps can occur. Some descriptions may reflect the language of their time. Transcripts created using speech-to-text tools may also contain inaccuracies, particularly with lower-quality audio or complex sound.</p>
        <p>If you notice an issue, please contact us at aapb_notifications@wgbh.org so we can review and make corrections.</p>
      </>
    ),
  },
  {
    q: "Who is eligible to contribute to the AAPB collection?",
    a: (
      <>
      <p>Public television and radio stations (including joint licensees), national public media organizations, public media producers (such as Public Radio International and Independent Television Service), and repositories holding public media content are all eligible to contribute materials to the American Archive of Public Broadcasting collection.</p>
    </>
    ),
  },
  {
    q: "How can my organization get involved in the American Archive of Public Broadcasting?",
    a: (
      <>
      <p>Organizations interested in participating in the AAPB can contact AAPB Project Staff at aapb_notifications@wgbh.org to schedule a conversation about how to get involved. Additional information about contributing materials is available on the Contribute Content page.</p>
    </>
    ),
  },
];

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        className="faq-button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <h3 className="faq-question">
          {question}
        </h3>

        <span
          aria-hidden="true"
          className={`faq-icon ${open ? "open" : ""}`}
        >
          +
        </span>
      </button>

      {open && (
        <div className="faq-answer">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="page-container">
      <div className="skinny-body-container marbot">
        <a className="back-link-nav" href="/about">
          &lt; About the AAPB
        </a>
        <h1 className="marbot">FAQ</h1>
        {faqs.map((item, i) => (
          <FAQItem key={i} question={item.q} answer={item.a} />
        ))}
        <LinkBankFooter />
      </div>


    </div>
  );
}
