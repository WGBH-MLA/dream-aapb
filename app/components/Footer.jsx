export default function Footer(props) {
  let linkData = {
    participate: {
      title: "Participate",
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
      title: "About",
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

  }

  return (
    <div className="footer-bar">
      <FooterLinks links={ linkData.participate } />
    </div>
  )
}


function FooterLinks(props){
  let links
  if(props.links){
    links = props.links.map((link) => {
      return <a className="footer-link" href={link.url} >{link.text}</a>
    })
  }
  return (
    <div className="footer-links">
      { links }
    </div>


  )
}