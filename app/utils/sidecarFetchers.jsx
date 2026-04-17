const S3BASE = "https://s3.us-east-1.amazonaws.com/americanarchive.org"
import checkForFile from "./checkForFile"

export async function getAD(guid){
  return await checkForFile( adURL(guid) )
}

function adURL(guid){
  return `${S3BASE}/audio_descriptions/${guid}/master.m3u8`
}

export async function getCaption(guid){
  // I for one propose that we trashcan this srt format for good!
  // let result = await checkForFile( srtCaptionURL(guid) )
  // if(!result){
  //   result = await checkForFile( vttCaptionURL(guid) )
  // }
  let result = await checkForFile( vttCaptionURL(guid) )
  return result
}

// function srtCaptionURL(guid){
//   return `${S3BASE}/captions/${guid}/${guid}.srt1.srt`
// }

function vttCaptionURL(guid){
  return `${S3BASE}/captions/${guid}/${guid}.vtt`
}
