import { useEffect } from "react"
import { useLoaderData, useOutletContext } from "react-router"
import { dangerousDiv } from "../classes/contentHelpers"
import { notEmpty, pageTitle } from "../utils/helpers"
import orgs from "../data/orgs.json"
import BarTitle from "../components/BarTitle"

export const loader = async ({ params }) => {
  const org = orgs[params.orgId]

  if (!org) {
    throw new Response("Organization not found", {
      status: 404,
      statusText: `Organization ${params.orgId} not found`,
    })
  }

  return {
    org,
    orgId: params.orgId,
    esIndex: process.env.ES_INDEX || "hot-aapb",
  }
}

export default function OrganizationShow() {
  const { org, esIndex } = useLoaderData()
  const { setPagedata } = useOutletContext()


  const shortName = org.short_name || org.Name || ""
  const city = org.city || org.City || ""
  const state = org.state || org.State || ""
  const locationText = [city, state].filter(Boolean).join(", ")

  const logoSrc = org.logo_src
    ? org.logo_src
    : org.Logo
      ? `https://s3.amazonaws.com/americanarchive.org/org-logos/${org.Logo}`
      : ""

  const urls = Array.isArray(org.urls)
    ? org.urls
    : Array.isArray(org.URLs)
      ? org.URLs
      : []

  const aboutHtml = org.about_html || org.About || ""

  const facetUrl =
    org.facet_url ||
    `/catalog?${esIndex}[refinementList][contributing_orgs][0]=${encodeURIComponent(shortName)}`

  useEffect(() => {
    if (setPagedata && shortName) {
      setPagedata({ title: pageTitle(shortName) })
    }
  }, [shortName])

   return (
    <>
      <div className="body-container">
        <a className="back-link-nav" href="/organizations">&lt; Back to Organizations</a>
        <BarTitle title="Participating Organizations" />
      </div>

      <div className="skinny-body-container org-page">
        <div className="org-o-tron marbot">
          <h2>{shortName}</h2>

          {locationText && <p>{locationText}</p>}

          {notEmpty(logoSrc) && (
            <img
              src={logoSrc}
              alt={`${shortName} logo`}
              className="org-logo"
            />
          )}

          {urls.map((url, i) => (
            <p key={i}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </p>
          ))}

          <p>
            <a href={facetUrl} className="org-records-btn">
              VIEW ALL RECORDS
            </a>
          </p>
        </div>

        {notEmpty(aboutHtml) && (
          <div className="org-about marbot">
            <h2 className="smarbot">About</h2>
            {dangerousDiv(aboutHtml, false)}
          </div>
        )}
      </div>
    </>
  )
}