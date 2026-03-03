export async function getPreview(id, content_type, token) {
  // exhibit_page or collection_page
  let url = `${process.env.AAPB_API_URL}/page_preview/${id}/?content_type=${content_type}&token=${token}`
  return await fetch(url, (res) => {
    console.log("preview", res)
  })
}
