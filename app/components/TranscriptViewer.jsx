import { Play } from "lucide-react"

export default function TranscriptViewer(props){
  let lines
  if(props.lines){
    lines = props.lines.map((line) => <TranscriptLine vjs={ props.vjs } cuePlayer={ props.cuePlayer } text={ line.text } startTime={ line.start_time } endTime={ line.end_time } /> )

    return (
      <div className="transcript-viewer">
        { lines }
      </div>
    )
  } else if(props.guid) {
    return "Transcript Not Available"
  }
  
}

function TranscriptLine(props){
  return (
    <div className="transcript-line">
      <Play onClick={ () => props.cuePlayer(props.vjs, props.startTime) } />{ props.text }
    </div>
  )
}
