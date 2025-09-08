import Thumbnail from "./Thumbnail"

export default function TVMenu(props){
  let programs = props.programs
  if(props.programs){
    if(programs.length == 3){
      programs = programs.map( (program) => {
        program.classes = " three"
        return program
      })
    }
    programs = programs.map((program) => TVProgram(program))
  }

  let seeAll
  if(props.seeAllURL){
    seeAll = <a className="see-all" href={ props.seeAllURL }>See All</a>
  }
  let classes = "tv-menu-container"
  if(programs.length == 3){
    classes += " three"
  }
  return (
    <div className={ classes }>
      { seeAll }
      <div className="tv-menu-body">
        <h2>{props.title}</h2>
        { programs }
      </div>
    </div>
  )
}

function TVProgram(props){
  let thumb
  if(props.guid){
    // it's a record
    thumb = <Thumbnail guid={props.guid} mediaType={props.mediaType} />
  } else {
    // it's just an image
    thumb = <Thumbnail url={props.thumbnailURL} />
  }
  return (
    <div key={props.key} className={"tv-menu-program marleft marbot" + (props.classes ? props.classes : "")} >
      <a href={props.url} >
        { thumb }
        <h4>{ props.title }</h4>
        <h5>{ props.subtitle }</h5>
      </a>
    </div>
  )
}