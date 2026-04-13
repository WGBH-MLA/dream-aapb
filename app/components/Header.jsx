import { useState } from "react"
import { useNavigate } from "react-router"
import DrawerMenu from "./DrawerMenu"
import LayoutSearch from "./LayoutSearch"

const drawerItems = {
  explore: [
    {
      label: "Collections",
      url: "/collections",
      external: false,

    },
    {
      label: "Scholarly Exhibits",
      url: "/exhibits",
      external: false,

    },
    {
      label: "Educator Resources",
      url: "/resources",
      external: false,

    },
    {
      label: "National History Day",
      url: "/national-history-day",
      external: false,
    },
  ],
  participate: [
    {
      label: "Contribute Content",
      url: "/contribute",
      external: false,

    },
    {
      label: "Fix Transcripts",
      url: "/fixitplus",
      external: false,

    },
  ],
  about: [
    {
      label: "About the AAPB",
      url: "/about",
      external: false,

    },
    {
      label: "Participating Organizations",
      url: "/organizations",
      external: false,

    },
    {
      label: "Visit",
      url: "/visit",
      external: false,

    },
    {
      label: "FAQ",
      url: "/faq",
      external: false,

    },
  ]
}

export default function Header(props) {
  let navigateHook = useNavigate()
  const [hovered, setHovered] = useState(false)
  let layoutSearch
  if(!props.isHomepage){
    const [search, setSearch] = useState("")
    const handleLayoutSearch = (val) => {
      setSearch(val)
    }

    layoutSearch = (
      <LayoutSearch
        navigateHook={ navigateHook }
        esIndex={ props.esIndex }
        handleChange={ handleLayoutSearch }
        searchQuery={ search }
      />
    )
  }

  return (
    <div>
      <a className="america-250" href="/america250">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span style={{transform: hovered ? 'translateY(3px)' : 'translateY(0)'}}>
            CELEBRATING AMERICA 250 {'>'}
          </span>
        </div>
      </a>
      
      <div className="header-bar marbot">
        <a href="/">
          <img src="/aapb.png" className="header-logo" />
        </a>
        <div className="header-spacer" />
        <DrawerMenu label="Explore" items={drawerItems.explore} />
        <DrawerMenu label="Participate" items={drawerItems.participate} />
        <DrawerMenu label="About" items={drawerItems.about} />
        { layoutSearch }
      </div>
      <div className="header-bar marbot">
        <a href="/">
          <img src="/corner-squares.png" className="header-squares" />
        </a>
      </div>
    </div>
  )
}
