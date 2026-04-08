import thumbnailURL from "./thumbnailURL"

export function recordToTVProgram(record){
  let title,subtitle,thumbnail,url

  if(record.title && record.title.length > 0){
    title = record.title
  } else {
    title = "Untitled Record"
  }

  if(record.pbcoreDescriptionDocument && record.pbcoreDescriptionDocument.pbcoreDescription && record.pbcoreDescriptionDocument.pbcoreDescription.length > 0 && record.pbcoreDescriptionDocument.pbcoreDescription[0].text){
    subtitle = record.pbcoreDescriptionDocument.pbcoreDescription[0].text.slice(0,128)
  }

  url = `/catalog/${record.guid}`

  return {
    key: record.guid,
    guid: record.guid,
    title: title,
    // subtitle: subtitle,
    // thumbnail: thumbnail,
    mediaType: record.media_type,
    url: url
  }
}

export function collectionToTVProgram(collection){
  let title,subtitle,thumbnail,url

  if(collection.title && collection.title.length > 0){
    title = collection.title
  } else {
    title = "Untitled Collection"
  }

  url = `/collections/${collection.meta.slug}`
  return {
    key: collection.meta.slug,
    title: title,
    // subtitle: subtitle,
    // TODO: need thumbnail url in collections/ serializer
    thumbnailURL: "Placeholder.jpg",
    url: url
  }
}

export function exhibitToTVProgram(exhibit){
  let title,subtitle,thumbnail,url
  if(exhibit.title && exhibit.title.length > 0){
    title = exhibit.title
  } else {
    title = "Untitled Exhibit"
  }

  url = `/exhibits/${exhibit.meta.slug}`
  return {
    key: exhibit.meta.slug,
    title: title,
    // subtitle: subtitle,
    thumbnailURL: "Placeholder.jpg",
    url: url
  }
}
