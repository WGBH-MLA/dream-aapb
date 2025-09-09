import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router'

export const meta = () => {
  return [{ charset: 'utf-8' }]
}

export const loader = () => {
  return { indexName: process.env.ES_INDEX_NAME }
}

// standard
import '@fontsource/inter/400.css'
// bold
import '@fontsource/inter/600.css'
import Header from './components/Header'
import Footer from './components/Footer'
import './styles/styles.css'

export default function App() {
  const data = useLoaderData()
  return (
    <html>
      <head>
        <link rel='icon' href='data:image/x-icon;base64,AA' />
        <Meta />
        <Links />
      </head>
      <body>
        <Header indexName={data.indexName} />
        <Outlet />
        <Footer />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  console.log('error', error)
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
        <title>Oh no!</title>
      </head>
      <body>
        <div className='page-body-container'>
          {isRouteErrorResponse(error) ?
            <>
              <h1>{error.status} error</h1>
              <h3>{error.data}</h3>
              <p>{error.statusText}</p>
            </>
          : <div className='error-container'>
              <h1>Oh no!</h1>
              <p>Oops! Something went wrong. Please try again later.</p>
            </div>
          }
        </div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
