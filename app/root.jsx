import {
  Links,
  Meta,
  Outlet,
  Scripts,
} from "@remix-run/react";

import Header from "./components/Header"
import Footer from "./components/Footer"
import "./styles/styles.css"

export default function App() {
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
        <Header />
        <Outlet />
        <Footer />

        <Scripts />
      </body>
    </html>
  );
}
