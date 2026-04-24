import { useEffect, useState } from "react"
import { Play } from "lucide-react"
import videojs from "video.js"

export default function ClientTranscriptViewer(props){
  const [currentTime, setCurrentTime] = useState(false)
  useEffect(() => {
    let player = videojs.players["vjs-player"]
    if(player){
      player.on("timeupdate", () => {
        // every time the playhead moves...
        setCurrentTime( player.currentTime() )

      })  
    }  
  }, [])

  let lines
  if(props.lines){
    lines = props.lines.map((line,i) => <TranscriptLine key={i} text={ line.text } startTime={ line.start_time } endTime={ line.end_time } currentTime={ currentTime } /> )

    return (
      <>
        <div className="show-metadata-header">Transcript</div>
        <div className="transcript-viewer marbot">
          { lines }
        </div>
      </>
    )
  } else if(props.guid) {
    return "Transcript Not Available"
  }
}

function TranscriptLine(props){
  let classes = "transcript-line"
  if(props.startTime < props.currentTime && props.endTime > props.currentTime){
    classes += " highlight"
  }
  return (
    <div className={ classes }>
      <Play fill={"#d2d5e2"} onClick={ () => cuePlayer(props.startTime) } />
      <div>{ props.text }</div>
      <span className="smarleft">{secondsToHMS(props.startTime)}-{secondsToHMS(props.endTime)}</span>
    </div>
  )
}

function cuePlayer(time){
  let player = videojs.players["vjs-player"]
  if(player.paused()){
    player.play()
  }
  player.currentTime(time)
}

function secondsToHMS(seconds){
  return new Date(seconds * 1000).toISOString().slice(11, 19)
}