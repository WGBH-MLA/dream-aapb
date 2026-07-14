import { decode } from "html-entities"
import thumbnailURL from "./thumbnailURL"

export function recordToTVProgram(record){
  let title,desc,thumbnail,url

  if(record.title && record.title.length > 0){
    title = record.title
  } else {
    title = "Untitled Record"
  }

  if(record.pbcoreDescriptionDocument && record.pbcoreDescriptionDocument.pbcoreDescription && record.pbcoreDescriptionDocument.pbcoreDescription.length > 0 && record.pbcoreDescriptionDocument.pbcoreDescription[0].text){
    desc = record.pbcoreDescriptionDocument.pbcoreDescription[0].text.slice(0,128)
  }

  url = `/catalog/${record.guid}`

  return {
    key: record.guid,
    guid: record.guid,
    title: title,
    desc: desc,
    // thumbnail: thumbnail,
    mediaType: record.media_type,
    url: url
  }
}

export function collectionToTVProgram(collection){
  let title,desc,thumbnail,url

  if(collection.title && collection.title.length > 0){
    title = collection.title
  } else {
    title = "Untitled Collection"
  }

  let imgURL = "Placeholder.jpg"
  if(collection.cover_image && collection.cover_image.full_url){
    imgURL = collection.cover_image.full_url
  }

  if(collection.introduction){
    desc = decode(collection.introduction).replace(/<[^>]*>?/gm, "").slice(0,128).trim() + "..."
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

export function exhibitToTVProgram(exhibit){
  let title,desc,thumbnail,url
  if(exhibit.title && exhibit.title.length > 0){
    title = exhibit.title
  } else {
    title = "Untitled Exhibit"
  }

  let imgURL = "Placeholder.jpg"
  if(exhibit.cover_image && exhibit.cover_image.full_url){
    imgURL = exhibit.cover_image.full_url
  }
  url = `/exhibits/${exhibit.meta.slug}`
  return {
    key: exhibit.meta.slug,
    title: title,
    thumbnailURL: imgURL,
    url: url
  }
}
