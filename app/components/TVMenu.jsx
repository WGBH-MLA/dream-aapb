import Thumbnail from "./Thumbnail"

export default function TVMenu(props){
  let classes = "tv-menu-container bmarbot"

  let programs = props.programs
  if(props.programs){

    if(programs.length == 3){
      programs = programs.map( (program) => {
        program.classes = " three"
        return program
      })

      classes += " three"
    } else {
      classes += " four"
    }

    programs = programs.slice(0,4)
    programs = programs.map((program) => TVProgram({...program, showDesc: props.showDesc}))
  }

  let seeAll
  if(props.seeAllURL){
    seeAll = <a className="see-all" href={ props.seeAllURL }>See All</a>
  }

  return (
    <div className={ classes }>
      { seeAll }
      <h2>{props.title}</h2>
      <div className="tv-menu-body">
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
    <div key={props.key} className={"tv-menu-program " + (props.classes ? props.classes : "")} >
      <a href={props.url} >
        { thumb }
        <h4>{ props.title }</h4>
        {props.showDesc && <h5 className="tv-menu-program-desc">{ props.desc }</h5> }
      </a>
    </div>
  )
}