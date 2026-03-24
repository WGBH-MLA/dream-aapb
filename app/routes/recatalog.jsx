import { redirect } from 'react-router'
export const loader = async ({ request }) => {
  const url = new URL(request.url)
  let dest = url.toString().replace("/recatalog", "/catalog")
  console.log( 'on my way to ', dest )
  return redirect( dest )
}

export default function Recatalog() {
  return null
}
