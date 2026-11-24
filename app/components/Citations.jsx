import { notEmpty } from "../utils/helpers"

export default function Citations({ record }) {
  const url = `http://americanarchive.org/catalog/${record.guid}`

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  })

  // same dedupe and AAPB filter used for the Contributing Organization box
  const orgNames = [...new Set(record.contributing_orgs || [])]
    .filter((co) => co != "American Archive of Public Broadcasting")

  const org =
    (orgNames.length > 0 ? orgNames.join(", ") + ", " : "") +
    "American Archive of Public Broadcasting (GBH and the Library of Congress), Boston, MA and Washington, DC"

  const dates = record.pbcoreDescriptionDocument.pbcoreAssetDate
  const assetDate = notEmpty(dates) ? dates[0].text : null

  const title = record.title

  return (
    <>
      <div className="citation"><strong>Chicago</strong>: “{ title },” { assetDate && `${assetDate}, ` }{ org }, accessed { today }, { url }.</div>
      <div className="citation"><strong>MLA</strong>: “{ title }.” { assetDate && `${assetDate}. ` }{ org }. Web. { today }. &lt;{ url }&gt;.</div>
      <div className="citation"><strong>APA</strong>: { title }. Boston, MA: { org }. Retrieved from { url }</div>
    </>
  )
}