import { useState } from 'react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router"

export const meta = () => {
  return [
    {charset: "utf-8"}
  ]
}

export const loader = () => {
  return {
    wagtailHost: process.env.WAGTAIL_HOST,
    esIndex: process.env.ES_INDEX,
    esURL: process.env.ES_URL,
    apiKey: process.env.ES_API_KEY,
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


        <Header esIndex={ data.esIndex } />
        <Outlet />
        <Footer />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
