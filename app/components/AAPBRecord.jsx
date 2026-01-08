import { useEffect, useState, useRef } from 'react'
import {
  FileLock,
  FileQuestion,
  FileVideo,
  FileVolume,
  FileX2,
} from 'lucide-react'
import VideoPlayer from "../components/VideoPlayer"
import { getRecord } from "../utils/getRecord"

function mediaType(pbcore) {
  let inst = pbcore.pbcoreDescriptionDocument?.pbcoreInstantiation
  if (!inst) {
    return false
  }
  if (!(inst instanceof Array)) {
    inst = [inst]
  }
  if (
    inst.some(
      (i) => i.instantiationMediaType == 'Moving Image'
    )
  ) {
    return 'Moving Image'
  }
  if (
    inst.some((i) => i.instantiationMediaType == 'Sound')
  ) {
    return 'Sound'
  }
}

function playable(pbcore) {
  // this detects whether the record is allowed to be played in order to display the doc icon etc instead of blocked player
  if (pbcore?.pbcoreDescriptionDocument?.pbcoreAnnotation) {
    let annos = pbcore.pbcoreDescriptionDocument.pbcoreAnnotation
    if (!(annos instanceof Array)) {
      annos = [annos]
    }

    let accessAnno = annos.find(
      (a) => a.annotationType == 'Level of User Access'
    )
    if (accessAnno?.text == 'Online Reading Room') {
      return true
    } else {
      return false
    }
  } else {
    // no pbcore was retrieved from aapb
    return false
  }
}

function aapbThumbnailURL(guid) {
  const S3_BASE = 'https://s3.amazonaws.com/americanarchive.org'
  return `${S3_BASE}/thumbnail/${guid}.jpg`
}

function aapbTitle(pbcore) {
  let pbt = pbcore?.pbcoreTitle
  if (pbt?.length > 0) {
    // there are multiple titles
    return pbt.map((title) => title.text).join('; ')
  } else {
    // this will show when no titles but also when record fails to fetch from AAPB at all
    return 'Untitled Record'
  }
}

// function embed(guid, startTime, endTime, wide, key) {
//   var times
//   if (startTime || endTime) {
//     times = `?start=${startTime}&end=${endTime}`
//   }
//   var url = `/embed/${guid}${times || ''}`

//   var iframeClasses = 'aapb-record-video'
//   var containerClasses = 'content-aapbblock'
//   if (wide) {
//     iframeClasses += ' wide'
//     containerClasses += ' wide'
//   }
//   return (
//     <a key={key} className={containerClasses}>
//       <iframe
//         className={iframeClasses}
//         src={url}
//         frameBorder='0'
//         allowFullScreen={true}
//       />
//     </a>
//   )
// }

export default function AAPBRecord(props) {
  const [showPlayer, setShowPlayer] = useState(false)
  let recordBlock
  let titleBar
  let title
  if(props.title){
    title = props.title
  } else if(props.pbcore){
    title = aapbTitle(props.pbcore)
  }

  if (props.showTitle) {
    titleBar = (
      <div className='shade-bar'>
        <a href={`/catalog/${props.guid}`}>
          { title }
        </a>
      </div>
    )
  }

  let icon, backgroundImage
  let realMediaPlayer = true
  if (props.showThumbnail) {
    if (props.pbcore) {
      if (playable(props.pbcore)) {
        //just get from pbcore dummy
        let mt = props.mediaType
        if (mt == 'Moving Image') {
          // check here for digitized? if not show VIDEO THUMB
          var ci_pbi =
            props.pbcore.pbcoreDescriptionDocument.pbcoreIdentifier.find(
              (pbi) => pbi.source == 'Sony Ci'
            )
          if (ci_pbi && ci_pbi.text) {
            backgroundImage = `url(${aapbThumbnailURL(props.guid)})`
          } else {
            // video THUMB
            icon = <FileVideo size={'50%'} />
          }
        } else if (mt == 'Sound') {
          // AUDIO THUMB
          icon = <FileVolume size={'50%'} />
        } else {
          // Neither audio nor video: ?
          icon = <FileQuestion size={'50%'} />
        }
      } else {
        icon = <FileLock size={'50%'} />
        // not playable so also disable player
        realMediaPlayer = false
      }
    } else {

      // didn't get any dang pbcore
      icon = <FileX2 size={'50%'} />
      // not playable so also disable player
      realMediaPlayer = false
    }
  }

  let playButton
  //just get from pbcore dummy
  if (props.mediaType) {
    playButton = (
      <div className='blue-circle'>
        <div />
      </div>
    )
  }

  if(showPlayer) {
    recordBlock = <div className='content-aapbblock'><VideoPlayer guid={props.guid} mediaURL={props.mediaURL} mediaType={props.mediaType} mediaPlayable={playable(props.pbcore)} title={props.title} wide={props.wide} startTime={props.startTime} endTime={props.endTime} cmsPlayer={true} /></div>
  } else {

    if (realMediaPlayer) {

      recordBlock = (
        <div
          style={{ backgroundImage }}
          className='content-aapbblock'
          onClick={() => setShowPlayer(true) }>
          {icon}
          {titleBar}
          {playButton}
        </div>
      )
    } else {

      recordBlock = (
        <div
          style={{ backgroundImage }}
          className='content-aapbblock'
        >
          {icon}
          {titleBar}
        </div>
      )
    }
  }

  return recordBlock
}



