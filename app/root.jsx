import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData}from "@remix-run/react"

export const loader = () => {
  return {indexName: process.env.ES_INDEX_NAME}
}

// standard
import "@fontsource/inter/400.css";
// bold
import "@fontsource/inter/600.css";
import Header from "./components/Header"
import Footer from "./components/Footer"
import "./styles/styles.css"

export default function App() {
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
        <Header indexName={ data.indexName } />
        <Outlet />
        <Footer />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
