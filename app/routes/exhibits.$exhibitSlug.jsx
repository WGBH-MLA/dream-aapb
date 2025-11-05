import { useLoaderData } from "react-router"
import { getPageBySlug } from "../utils/fetch"
import { renderExhibit } from "../classes/exhibitPresenter"
import { extractMeta } from "../utils/meta"

export const loader = async ({
  params,
  request,
}) => {

  let server_url = process.env.WAGTAIL_HOST
  let exhibit
  // exhibit = await getPageBySlug('exhibits', params.exhibitSlug)
  exhibit = {
    title: "Fake Exhibit",
    authors: [
      {
        name: "Johnny Juice",
        img_url: "/johnny.png",
        bio: "The first author that ever existed in the world."
      },
      {
        name: "Jenny Jam",
        img_url: "/jenny.png",
        bio: "And lo another author was born, torn from the cloth of the first."
      },
    ],
    content: [
      {
        id: "zvb9db7",
        type: "text",
        value: "it's a <b>BODY</b> thang...",
      },
      {
        id: "sdfjdb7",
        type: "text",
        value: "<p>it'soh wownnng! <img class='right' src='/silly.png' /></p><p>wowie!<img class='left' src='/silly.png' /></p>",
      },      
      {
        id: "xxxdedf3",
        type: "credits",
        value: "and thats why we're giving YOU the <i>credit</i>",
      },
    ]
  }
  return { exhibit, server_url }
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
      content:
        exhibit?.meta?.search_description || 'AAPB Exhibit',
    },
    ...extractMeta(data.server_url, exhibit),
  ]
}

export default function Exhibit() {
  const data = useLoaderData()
  return renderExhibit(data.exhibit)
}
