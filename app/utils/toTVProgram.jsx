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

  url = `/search/${record.guid}`

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

  console.log( 'the collection', collection )
  let title,subtitle,thumbnail,url

  if(collection.title && collection.title.length > 0){
    title = collection.title
  } else {
    title = "Untitled collection"
  }

  // if(collection.pbcoreDescriptionDocument && collection.pbcoreDescriptionDocument.pbcoreDescription && collection.pbcoreDescriptionDocument.pbcoreDescription.length > 0 && collection.pbcoreDescriptionDocument.pbcoreDescription[0].text){
  //   subtitle = collection.pbcoreDescriptionDocument.pbcoreDescription[0].text.slice(0,128)
  // }

  url = `/collections/${collection.meta.slug}`
  console.log( 'collection', collection )
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

  console.log( 'the exhibit', exhibit )
  let title,subtitle,thumbnail,url
  if(exhibit.title && exhibit.title.length > 0){
    title = exhibit.title
  } else {
    title = "Untitled Exhibit"
  }

  // if(exhibit.pbcoreDescriptionDocument && exhibit.pbcoreDescriptionDocument.pbcoreDescription && exhibit.pbcoreDescriptionDocument.pbcoreDescription.length > 0 && exhibit.pbcoreDescriptionDocument.pbcoreDescription[0].text){
  //   subtitle = exhibit.pbcoreDescriptionDocument.pbcoreDescription[0].text.slice(0,128)
  // }

  url = `/exhibits/${exhibit.meta.slug}`

  return {
    key: exhibit.meta.slug,
    title: title,
    // subtitle: subtitle,
    thumbnailURL: "Placeholder.jpg",
    url: url
  }
}
