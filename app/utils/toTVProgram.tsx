import { decode } from "html-entities"
import thumbnailURL from "./thumbnailURL"
import { Exhibit, AAPBRecord } from "../types/aapb"

export function recordToTVProgram(record: AAPBRecord) {
  if (!record.title || record.title.length === 0) {
    record.title = "Untitled Record"
  }

  if (record.pbcore?.pbcoreDescription && record.pbcore.pbcoreDescription.length > 0 && record.pbcore.pbcoreDescription[0].text) {
    record.desc = record.pbcore.pbcoreDescription[0].text.slice(0, 128)
  }

  record.url = `/catalog/${record.guid}`
  record.key = record.guid


  return record
}

export function collectionToTVProgram(collection) {
  let title, desc, thumbnail, url

  if (collection.title && collection.title.length > 0) {
    title = collection.title
  } else {
    title = "Untitled Collection"
  }

  let imgURL = "Placeholder.jpg"
  if (collection.cover_thumb?.full_url) {
    imgURL = collection.cover_thumb.full_url
  }

  if (collection.introduction) {
    desc = decode(collection.introduction).replace(/<[^>]*>?/gm, "").slice(0, 128).trim() + "..."
  }

  url = `/collections/${collection.meta.slug}`

  return {
    key: collection.meta.slug,
    title: title,
    desc: desc,
    thumbnailURL: imgURL,
    url: url
  }
}

export function exhibitToTVProgram(exhibit: Exhibit) {
  if (!exhibit) {
    return null
  }
  if (!(exhibit.title?.length > 0)) {
    exhibit.title = "Untitled Exhibit"
  }
  if (exhibit.cover_thumb?.full_url) {
    exhibit.thumbnailURL = exhibit.cover_thumb.full_url
  } else {
    exhibit.thumbnailURL = "Placeholder.jpg"
  }
  exhibit.url = `/exhibits/${exhibit.meta.slug}`
  exhibit.key = exhibit.meta.slug
  return exhibit
}
