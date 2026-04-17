export default async function checkForFile(url){
  // returns the url if present
  let resp = await fetch(url, {method: "HEAD"})
  return (resp && resp.status == 200) ? url : false
}
