import { useLoaderData } from "react-router"
import { getPageBySlug } from "../utils/fetch"
import { renderExhibit } from "../classes/exhibitPresenter"
import { extractMeta } from "../utils/meta"
import AAPBRecord from "../components/AAPBRecord"
import { getRecords } from "../utils/getRecord"

export const loader = async ({
  params,
  request,
}) => {

  // let serverURL = process.env.AAPB_API_URL || "http://aapb-api/api/v2"
  // let esIndex = process.env.ES_INDEX || "hot-aapb"
  // let esURL = process.env.ES_URL || "https://elastic.dev.wgbh-mla.org"
  // let apiKey = process.env.ES_API_KEY || "bjVNcTVwc0JXX1JRWThNV091ZTc6WDdiUG0tVHl5dlE2M2dYaUctcnFodw=="
  let serverURL = "http://aapb-api/api/v2"
  let esIndex = "hot-aapb"
  let esURL = "https://elastic.dev.wgbh-mla.org"
  let apiKey = "bjVNcTVwc0JXX1JRWThNV091ZTc6WDdiUG0tVHl5dlE2M2dYaUctcnFodw=="

  let exhibit
  exhibit = await getPageBySlug('aapb_exhibits.AAPBExhibit', params.exhibitSlug)
  // console.log( 'exy', exhibit )
  // find aapb_records blocks
  let aapb_record_blocks = exhibit.body.filter((block) => block.type == "aapb_record")
  if(aapb_record_blocks.length > 0){
    // there are record blocks

    // get the record data for these aapb records in one query
    let aapb_record_data = await getRecords( aapb_record_blocks.map((ar) => ar.guid ), esURL, esIndex, apiKey )

    // format to hash so less looping
    let aapb_record_dict = {}

    // structure dict like this because we may need other derived fields to use in the aapb record
    if(aapb_record_data && aapb_record_data.length > 0){
      aapb_record_data.forEach((record) => aapb_record_dict[record.guid] = {title: record.title, pbcore: record.pbcoreDescriptionDocument})
    }

    exhibit.body = exhibit.body.map((block) => {
      // mix them back in to the real blocks
      if(block.type == "aapb_record"){

        if(aapb_record_dict[block.guid]){
          block.title = aapb_record_dict[block.guid].title
          block.pbcore = aapb_record_dict[block.guid].pbcore
          block.wide = isWide(block.pbcore)
        }
        
      }

      return block
    })
  }

  exhibit.sections = [
    // {url: "google.com", text: "google"},
    // {url: "doogle.com", text: "doogle"},
    // {url: "shmoogle.com", text: "shmoogle"},
    {url: "/exhibits/misrepresentations", text: "(Mis)Representations of Native Americans"},
    {url: "/exhibits/termination-relocation-restoration", text: "Termination, Relocation, and Restoration"},
    {url: "/exhibits/aim", text: "The American Indian Movement"},
    {url: "/exhibits/contemporary-news", text: "Native Americans in Contemporary News Media"},
    {url: "/exhibits/visual-sovereignty", text: "Visual Sovereignty: Native-Created Public Media"},
    {url: "/exhibits/notes", text: "Notes"},

  ]

  return { exhibit, serverURL }
}

export const meta = ({ data }) => {
  let exhibit = data?.exhibit
  if (!exhibit) {
    return [
      { title: 'American Archive of Public Broadcasting' },
      {
        name: 'description',
        content: 'Exhibit from AAPB',
      },
    ]
  }
  return [
    { title: `${exhibit.title} | American Archive of Public Broadcasting` },
    {
      name: 'description',
      content: exhibit?.meta?.search_description || 'AAPB Exhibit',
      charset: 'utf-8'
    },
    ...extractMeta(data.serverURL, exhibit),
  ]
}

export default function Exhibit() {
  const data = useLoaderData()
  return renderExhibit(data.exhibit)
}

function isWide(pbcore){
  let isWide = false
  if (pbcore?.pbcoreDescriptionDocument?.pbcoreInstantiation) {
    let inst = pbcore.pbcoreDescriptionDocument.pbcoreInstantiation
    // Find all proxies
    let proxies = inst.find((i) => i.instantiationGenerations == 'Proxy')
    if (proxies) {
      // proxytome proxytome proxytome proxytome
      let aspects = []
      proxies.map((prox) => {
        // Get the aspect ratio of the essence tracks
        aspects.concat(
          prox.instantiationEssenceTrack.map(
            (et) => et.essenceTrackAspectRatio
          )
        )
      })

      // no nulls hon
      aspects = aspects.filter((obj) => obj)
      for (let aspect of aspects) {
        // A-S-P-E-C-T
        // Find out if it's 4:3!
        if (aspect.includes('16:9') || aspect.includes('1.778')) {
          // Just a little bit!
          isWide = true
          break
        }
      }
    }
  }

  return isWide
}
