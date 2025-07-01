import thumbnailURL from "./thumbnailURL"

export default function recordToTVProgram(record){
  let title,subtitle,thumbnail,url

  if(title && title.length > 0){
    title = record.title
  } else {
    title = "Untitled Record"
  }

  if(record.pbcoreDescriptionDocument && record.pbcoreDescriptionDocument.pbcoreDescription && record.pbcoreDescriptionDocument.pbcoreDescription.length > 0 && record.pbcoreDescriptionDocument.pbcoreDescription[0].text){
    subtitle = record.pbcoreDescriptionDocument.pbcoreDescription[0].text.slice(0,128)
  }

  thumbnail = thumbnailURL(record.guid)
  console.log( 'thumby', thumbnail )
  url = `/search/${record.guid}`

  return {
    key: record.guid,
    title: title,
    subtitle: subtitle,
    thumbnail: thumbnail,
    url: url
  }
}
