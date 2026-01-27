export async function getPreview(id, content_type, token) {
  // exhibit_page or collection_page
  let url = `${process.env.WAGTAIL_HOST}/preview/${id}/?content_type=${content_type}&token=${token}&format=json`
  return await fetch(url, (res) => {
    console.log("preview", res)
  })
}
