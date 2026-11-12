export async function geocode(ip){
  try {
    const respy = await fetch(`${ process.env.GEOCODE_API_URL }/${ip}`, (resp) => {
      console.log( 'geo', resp )
    })

    const body = await respy.json()
    return body.country
  } catch(err){
    console.log( 'oh no! a geocode error', err )
    return null
  }
}
