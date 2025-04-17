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
  return (
    <a href={props.url} >
      <div className={"tv-menu-program" + (props.classes ? props.classes : "")} >
        <img src={ props.thumbnail } />
        <h4>{ props.title }</h4>
        <h5>{ props.subtitle }</h5>
      </div>
    </a>
  )
}