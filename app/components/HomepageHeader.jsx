import React, { useState } from "react";
import DrawerMenu from "./DrawerMenu"
import DonateButton from "./DonateButton"

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
  const [hovered, setHovered] = useState(false);

return (
  <div>
    <a href="/america250" style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: '#9d2264',
          color: '#ffffff',
          textAlign: 'center',
          padding: '6px 16px',
          fontSize: '1rem',
          fontWeight: '600',
          letterSpacing: '0.1em',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={{
          display: 'inline-block',
          transform: hovered ? 'translateY(3px)' : 'translateY(0)',
          transition: 'transform 0.2s ease',
        }}>
          CELEBRATING AMERICA 250 >
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
      <DonateButton />
    </div>
  </div>
);
}
