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
  const [search, setSearch] = useState("")
  const handleLayoutSearch = (val) => {
    setSearch(val)
  }

  return (
    <div className="header-bar marbot">
      <a href="/" className="header-logo">
        <img src="/aapb.png" />
      </a>
      <div className="header-spacer" />
      <DrawerMenu label="Explore" items={ drawerItems.explore } />
      <DrawerMenu label="Participate" items={ drawerItems.participate } />
      <DrawerMenu label="About" items={ drawerItems.about } />
      <LayoutSearch
        navigateHook={ navigateHook }
        esIndex={ props.esIndex }
        handleChange={ handleLayoutSearch }
        searchQuery={ search }
      />
    </div>
  )
}
