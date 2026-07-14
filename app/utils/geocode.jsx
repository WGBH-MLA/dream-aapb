export async function geocode(ip){
  const respy = await fetch(`http://ip-api.com/json/${ip}`, (resp) => {
    console.log( 'hey!!!', resp )
  })

  console.log( 'crispy', respy )
  return respy
}
