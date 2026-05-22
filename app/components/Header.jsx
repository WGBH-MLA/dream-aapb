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
      label: "Exhibits",
      url: "/exhibits",
      external: false,

    },
    {
      label: "Educator Resources",
      url: "/resources",
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
      label: "Contributing Organizations",
      url: "/organizations",
      external: false,

    },
    {
      label: "Volunteer",
      url: "/volunteer",
      external: false,

    },
  ],
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
    <div className="header-container">
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
        <a href="/" className="header-logo">
          <img src="/aapb.png" />
        </a>
        <div className="header-spacer" />
        <DrawerMenu label="Explore" items={drawerItems.explore} />
        <DrawerMenu label="Participate" items={drawerItems.participate} />
        <a href="/about" className="drawer-label">About</a>
        { layoutSearch }
      </div>
      <div className="header-row">
        <img src="/corner-squares.png" className="header-squares" />
      </div>
    </div>
  )
}
