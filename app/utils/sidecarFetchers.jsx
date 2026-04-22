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

export async function getTranscript(guid){
  // if necessary try each guid variation
  return await checkForFile( transcriptURL(guid) )
}

export async function getTranscriptData(url){
  // returns the line objects only
  let resp = await fetch(url, {})
  let data = await resp.json()
  if(data && data.parts){
    return data.parts
  } else {
    return []
  }
}

function transcriptURL(guid){
  return `${S3BASE}/transcripts/${guid}/${guid}-transcript.json`
}

function idStyles(guid){
  // do we really have to still do this???
}
