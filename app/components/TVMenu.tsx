import { AAPBRecord } from "../types/aapb"
import Thumbnail from "./Thumbnail"

export default function TVMenu({ programs, seeAllURL, title }: { programs: AAPBRecord[], seeAllURL?: string, title?: string }, limit: number = 0) {

  if (limit > 0) {
    programs = programs.slice(0, limit)
  }
  programs = programs.map((program) => TVProgram(program))

  let seeAllLink
  if (seeAllURL) {
    seeAllLink = <a className="see-all" href={seeAllURL}>See All</a>
  }
  let classes = "tv-menu-container bmarbot"
  if (programs.length == 3) {
    classes += " three"
  } else {
    classes += " four"
  }

  return (
    <div className={classes}>
      {seeAllLink}
      <h2>{title}</h2>
      <div className="tv-menu-body">
        {programs}
      </div>
    </div>
  )
}

function TVProgram(props) {
  let thumb
  if (props.guid) {
    // it's a record
    thumb = <Thumbnail guid={props.guid} mediaType={props.mediaType} />
  } else {
    // it's just an image
    thumb = <Thumbnail url={props.thumbnailURL} />
  }
  return (
    <div key={props.key} className={"tv-menu-program " + (props.classes ? props.classes : "")} >
      <a href={props.url} >
        {thumb}
        <h4>{props.title}</h4>
        <h5 className="tv-menu-program-desc">{props.desc}</h5>
      </a>
    </div>
  )
}