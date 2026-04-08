import { useState } from 'react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation
} from "react-router"

export const meta = () => {
  return [
    {charset: "utf-8"}
  ]
}

export const loader = () => {
  return {
    wagtailHost: process.env.AAPB_API_URL || "http://aapb-api/api/v2",
    esIndex: process.env.ES_INDEX || "hot-aapb",
    esURL: process.env.ES_URL || "https://elastic.dev.wgbh-mla.org",
    apiKey: process.env.ES_API_KEY || "bjVNcTVwc0JXX1JRWThNV091ZTc6WDdiUG0tVHl5dlE2M2dYaUctcnFodw==",
  }
}

// standard
import "@fontsource/inter/400.css";
// bold
import "@fontsource/inter/600.css";
import Header from "./components/Header"
import Footer from "./components/Footer"
import "./styles/styles.css"

export default function App() {
  const [pleaseRotate, setPleaseRotate] = useState(false)

  const data = useLoaderData()
  const location = useLocation()
  const isHomepage = location.pathname === "/"
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <Links />
      </head>
      <body>

        <div className="rotation-helper" onClick={ () => { setPleaseRotate(!pleaseRotate) }} />

        <span className={ pleaseRotate ? "rotate" : "" }>
          <Header isHomepage={ isHomepage } esIndex={ data.esIndex } />
          <Outlet />
          <Footer />
        </span>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
