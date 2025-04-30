import DonateButton from "./DonateButton"
import NewsletterBar from "./NewsletterBar"
import ToeNail from "./ToeNail"

export default function Footer(props) {
  let linkData = {
    explore: {
      title: "EXPLORE",
      titleURL: "/explore",
      links: [
        {
          url: "/collections",
          text: "Collections"
        },
        {
          url: "/exhibits",
          text: "Scholarly Exhibits"
        },
        {
          url: "/resources",
          text: "Educator Resources"
        },
      ]
    },
    participate: {
      title: "PARTICIPATE",
      titleURL: "/participate",
      links: [
        {
          url: "/contribute",
          text: "Contribute Content"
        },
        {
          url: "/volunteer",
          text: "Vounteer"
        },
        {
          url: "/fixitplus",
          text: "Fix Transcripts"
        },
      ]
    },
    about: {
      title: "ABOUT",
      titleURL: "/about",
      links: [
        {
          url: "/about",
          text: "About the AAPB"
        },
        {
          url: "/visit",
          text: "Visit"
        },
        {
          url: "/faq",
          text: "FAQ"
        },
        {
          url: "/contact",
          text: "Contact Us"
        },        
      ]
    },
    last: {
      title: null,
      titleURL: null,
      links: [
        {
          url: "/blog",
          text: "Blog"
        },
        {
          url: "/feedback",
          text: "Feedback"
        },
        {
          url: "/content",
          text: "Content Statement"
        },
        {
          url: "/terms",
          text: "Terms of Use"
        },
        {
          url: "/privacy",
          text: "Privacy Policy"
        },
      ]
    },

  }

  return (
    <>
      <div className="footer-bar">
        <FooterLinks title={ linkData.explore.title } titleURL={ linkData.explore.titleURL } links={ linkData.explore.links } />
        <FooterLinks title={ linkData.participate.title } titleURL={ linkData.participate.titleURL } links={ linkData.participate.links } />
        <FooterLinks title={ linkData.about.title } titleURL={ linkData.about.titleURL } links={ linkData.about.links } />
        <FooterLinks links={ linkData.last.links } />

        <div className="footer-branding">
          <img src="/aapb.png" />
          <DonateButton />
        </div>
      </div>

      <NewsletterBar />
      <ToeNail />
    </>
  )
}


function FooterLinks(props){
  let links
  if(props.links){
    links = props.links.map((link,i) => {
      return <a key={i} className="footer-link" href={link.url} >{link.text}</a>
    })
  }

  let titleBlock
  if(props.title){
    titleBlock = (
      <a href={ props.titleURL }>
        <div className="footer-title">{ props.title }</div>
      </a>
    )
  }

  return (
    <div className="footer-stack">
      { titleBlock } 
      { links }
    </div>


  )
}