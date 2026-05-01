import { useEffect, useState } from "react"
import { Play, ChevronUp, ChevronDown, X } from "lucide-react"
import videojs from "video.js"
import { scrollToAnchor, secondsToHMS, visible, truth } from "../utils/helpers"

export default function ClientTranscriptViewer(props){
  const [currentTime, setCurrentTime] = useState(null)
  const [query, setQuery] = useState(null)
  const [selectedMatch, setSelectedMatch] = useState(0)
  
  const [matchIndexes, setMatchIndexes] = useState([])
  const [numMatches, setNumMatches] = useState(null)

  
  const handleChange = (e) => {
    let val = e.target.value
    if(e.target.value && e.target.value !== query){
      // always lowcase the stored query
      setQuery(e.target.value.toLowerCase())

      setNumMatches( getNumMatches(props.lines, query) )
    }
  }
  
  const handleMatchChange = (next) => {
    let newAnchorIndex

    if(next){
      newAnchorIndex = increment(1, selectedMatch, numMatches)
    } else {
      // last
      newAnchorIndex = increment(-1, selectedMatch, numMatches)
    }

    scrollToAnchor( matchAnchor( newAnchorIndex ) )
    setSelectedMatch( newAnchorIndex )
  }

  useEffect(() => {
    let player = videojs.players["vjs-player"]
    if(player){
      player.on("canplay", () => {
        player.on("timeupdate", () => {
          // every time the playhead moves...
          setCurrentTime( player.currentTime() )
        })
      })
    }
  }, [])

  let lines = props.lines
  // little hokey
  let counta = 0
  if(lines){

    lines = lines.map((line,i) => {
      let numMatchesInThisLine = numOccurrences(line.text, query)

      line = <TranscriptLine
        key={ i }
        text={ line.text }
        startTime={ line.start_time }
        endTime={ line.end_time }
        currentTime={ currentTime }

        // to mark the query in the displayed text
        query={ query }
        selectedMatch={ selectedMatch }
        numMatches={ numMatchesInThisLine }
        // use counta to drop the expected number of anchors -> we dont care where they are, just how many!!
        
        // this is what anchor num to start at for this line only
        matchAnchorStart={ numMatchesInThisLine > 0 ? counta : null }
      />

      counta += numMatchesInThisLine

      return line
    })

    return (
      <>
        <div className="transcript-viewer-header show-metadata-header">
          Transcript
          <TranscriptSearch
            handleChange={ handleChange }
            handleMatchChange={ handleMatchChange }
            query={ query }
            clearQuery={ () => setQuery(null) }
            selectedMatch={ selectedMatch }
            numMatches={ numMatches }
          />
        </div>
        
        <div id="transcript-viewer" className="transcript-viewer marbot">
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

  let text = props.text
  if( truth(props.matchAnchorStart) ){
    // we know this line has at least one match in it
    text = addAnchorsToLine(text, props.query, props.matchAnchorStart, props.selectedMatch)
  }

  return (
    <div className={ classes }>
      <Play fill={ "#d2d5e2" } onClick={ () => cuePlayer(props.startTime) } />
      <div dangerouslySetInnerHTML={{ __html: text }} />
      <span className="smarleft">{ secondsToHMS(props.startTime) }-{ secondsToHMS(props.endTime) }</span>
    </div>
  )
}

function TranscriptSearch(props){
  let matchLabel, upVal, downVal, matchX
  if(props.numMatches){
    // we always get a props.selectedMatch, even when tehres no query
    matchLabel = `${props.selectedMatch+1} of ${props.numMatches}`
    matchX = <X />
  }

  let viewer = document.getElementById("transcript-viewer")

  return (
    <div className="transcript-search">
      {/*Search the transcript*/}
      <input
        type="text"
        onChange={ props.handleChange }
        defaultValue={ props.query }
        placeholder="Search the transcript..."
      />
      <label>{ matchLabel }</label>
      <a onClick={ props.clearQuery }>{ matchX }</a>
      <a onClick={ (e) => props.handleMatchChange(false) }><ChevronUp /></a>
      <a onClick={ (e) => props.handleMatchChange(true) }><ChevronDown /></a>
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

function increment(val, current, numItems){
  if(current + val >= numItems){
    return 0
  } else if(current + val < 0){
    return numItems - 1
  } else {
    return current + val
  }
}

function transcriptMatches(lines, query){
  return lines.map((line) => {
    return line.text.toLowerCase().includes(query) ? line.text : null
  }).filter((line) => line)
}

function getNumMatches(lines, query){
  const fulltext = lines.reduce(
    (transcript, line) => transcript + line.text,
    "",
  )

  // total num matches in full transcript
  return numOccurrences(fulltext, query)
}

function numOccurrences(string, substring){
  return (string.match( queryRegex(substring) ) || []).length
}

function queryRegex(query) {
  // all occurences, case insensitive
  return new RegExp(`(${query})`, "gi")
}

function matchAnchor(num){
  return `m${num}`
}

function mark(matchText, anchorNum, hotAnchor){
  return `<mark class="${ hotAnchor ? "hot" : "" }" id="${ matchAnchor(anchorNum) }">${ matchText }</mark>`
}

function addAnchorsToLine(string, query, anchorStart, hotAnchor){
  let currentAnchor = anchorStart
  let pieces = string.split(query)
  let result = ""
  pieces.forEach((piece,i) => {
    result += piece
    if(i !== pieces.length-1){
      result += mark(query, currentAnchor, currentAnchor == hotAnchor)
    }
    currentAnchor += 1
  })

  return result
}
