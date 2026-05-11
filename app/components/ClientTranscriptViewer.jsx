import { useEffect, useState } from "react"
import { Play, ChevronUp, ChevronDown, ChevronRight, X, CircleArrowOutUpRight } from "lucide-react"
import videojs from "video.js"
import { scrollToAnchor, secondsToHMS, truth } from "../utils/helpers"

export default function ClientTranscriptViewer(props){
  const [currentTime, setCurrentTime] = useState(null)
  const [query, setQuery] = useState(null)
  const [selectedMatch, setSelectedMatch] = useState(0)
  
  const [matchIndexes, setMatchIndexes] = useState([])
  const [numMatches, setNumMatches] = useState(null)


  const clearQuery = (e) => {
    setQuery(null)
    setSelectedMatch(0)
    let input = document.getElementById("transcript-search-input")
    // hacky but otherwise doesnt get properly updated by state change, because of weird handling of input with defaultValue
    input.value = ""
  }

  const handleChange = (e) => {
    if(e.key === "Enter"){
      // use enter to cycle through matches

      // shift held: go up, else: go down
      handleMatchChange(!e.shiftKey)
    } else {
      // otherwise filter normally
      // filter out empty strangs
      let queryValue = truth(e.target.value) && e.target.value.length > 0 ? e.target.value : null
      setNumMatches( getNumMatches(props.lines, queryValue) )
      setQuery(queryValue)
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
  let counta = 0

  let classes = "transcript-viewer marbot"
  let headerClasses = "transcript-viewer-header show-metadata-header"
  let toggleMessage = props.viewerOpen ? "(Click to close)" : "(Click to expand)"
  
  let chevy
  if(props.viewerOpen){
    classes += " open"
    headerClasses += " open"
    chevy = <ChevronDown className="transcript-chevy" />
  } else {
   chevy = <ChevronRight className="transcript-chevy"/>
  }
  let toggler = <b onClick={ props.handleViewerToggle }>{ toggleMessage }{ chevy }</b>

  let transcriptSearch, transcriptViewer
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
        // this is what anchor num to start at for this line only
        matchAnchorStart={ numMatchesInThisLine > 0 ? counta : null }
      />

      counta += numMatchesInThisLine

      return line
    })

    transcriptSearch = (
      <TranscriptSearch
        open={ props.viewerOpen }
        handleChange={ handleChange }
        handleMatchChange={ handleMatchChange }
        query={ query }
        clearQuery={ clearQuery }
        selectedMatch={ selectedMatch }
        numMatches={ numMatches }
      />
    )

    transcriptViewer = (
      <div id="transcript-viewer" className={ classes }>
        { lines }
      </div>
    )
  }

  return (
    <>
      <div className={ headerClasses }>
        Transcript
        { toggler }
        { transcriptSearch }
      </div>
      
        { transcriptViewer }
    </>
  )
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
  let matchLabel, matchX
  let buttonClass, upClass, downClass
  buttonClass = upClass = downClass = "transcript-search-button"
  if(props.query && props.numMatches > 0 && truth(props.selectedMatch)){
    // we always get a props.selectedMatch, even when tehres no query
    matchLabel = `${props.selectedMatch+1} of ${props.numMatches}`
    matchX = <X />
  } else {
    matchLabel = `0 matches`
    upClass += " disable"
    downClass += " disable"
  }

  let classes = "transcript-search"
  if(props.open){
    classes += " open"
  }
  return (
    <div className={ classes } >
      {/*Search the transcript*/}
      <input
        id="transcript-search-input"
        key="transcript-tommy"
        type="text"
        onKeyUp={ (e) => props.handleChange(e) }
        defaultValue={ props.query }
        placeholder="Search the transcript..."
      />
      <label>{ matchLabel }</label>
      <a className={ buttonClass } onClick={ props.clearQuery }>{ matchX }</a>
      <a className={ upClass } onClick={ (e) => props.handleMatchChange(false,) }><ChevronUp /></a>
      <a className={ downClass } onClick={ (e) => props.handleMatchChange(true,) }><ChevronDown /></a>
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
    // return line.text.toLowerCase().includes(query) ? line.text : null
    return hasMatch(line.text, query)
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

function hasMatch(string, substring) {
  return string.search( queryRegex(substring) )
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
  let thatReggie = queryRegex(query)

  // split on case insensitive query matches, result contains the query parts too
  return string.split( thatReggie ).map((piece) => {
    if(piece.search( thatReggie ) > -1){
      // do it match?
      piece = mark(piece, currentAnchor, currentAnchor == hotAnchor)
      currentAnchor += 1
    }

    // next!
    return piece
  }).join("")
}

function piecefulString(string, pieces, pieceIndex, queryLength){
  let start = indexThroughEndOfPiece(pieces, pieceIndex, queryLength)
  let end = start + pieces[pieceIndex].length
  return string.slice(start, end)
}

function piecefulQuery(string, pieces, pieceIndex, queryLength ){
  let start = indexThroughEndOfPiece(pieces, pieceIndex, queryLength)
  let end = start + queryLength
  return string.slice(start, end)
}

function indexThroughEndOfPiece(pieces, pieceIndex, queryLength){
  let start = 0
  for(var i=0; i<pieceIndex; i++){
    start += pieces[i].length
    start += queryLength
  }
  return start
}

