export async function geocode(ip){
console.log( 'poop on you™' )
  const respy = await fetch(`http://ip-api.com/json/${ip}`, (resp) => {
    console.log( 'hey stupid!!!', resp )
  })

  console.log( 'crispy', respy )
  return respy
}
