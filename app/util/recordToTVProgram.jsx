import thumbnailURL from "./thumbnailURL"

export default function recordToTVProgram(record){
  let title,subtitle,thumbnail,url

  if(record.title && record.title.length > 0){
    title = record.title
  } else {
    title = "Untitled Record"
  }

  if(record.pbcoreDescriptionDocument && record.pbcoreDescriptionDocument.pbcoreDescription && record.pbcoreDescriptionDocument.pbcoreDescription.length > 0 && record.pbcoreDescriptionDocument.pbcoreDescription[0].text){
    subtitle = record.pbcoreDescriptionDocument.pbcoreDescription[0].text.slice(0,128)
  }

  thumbnail = thumbnailURL(record.guid)
  url = `/search/${record.guid}`

  return {
    key: record.guid,
    guid: record.guid,
    title: title,
    subtitle: subtitle,
    thumbnail: thumbnail,
    mediaType: record.media_type,
    url: url
  }
}
