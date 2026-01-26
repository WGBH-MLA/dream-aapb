import { useEffect } from "react"
import { ExternalLink, Search, X } from "lucide-react"

export default function LayoutSearch(props){
  let searchy = props.searchQuery

  // useEffect(() => {
  //   if(!props.searchQuery && props.queryFromURL && props.queryFromURL.length > 0 && props.queryFromURL != searchy){
  //     searchy = props.queryFromURL
  //   }
  // })

  function goToSearch(){
    let destination
    if(props.searchFilter){
      destination = `/catalog?${ props.esIndex }[query]=${searchy}${props.searchFilter}`
    } else {
      destination = `/catalog?${ props.esIndex }[query]=${searchy}`
    }
    if(!window.location.pathname.includes("/catalog")){
      // regular navigate
      props.navigateHook(destination)
    } else {
      // just force refresh since we're on search page
      window.location.href = destination
      window.location.reload()
    }
  }

  function handleEnter(e){
    if(e.key == "Enter"){
      goToSearch()
    }
  }

  let classes = "layout-search"
  if(props.wide){
    classes += " wide"
  }

  let placeholder
  if(props.placeholder){
    placeholder = props.placeholder
  } else {
    placeholder = "Search the Archive"
  }

  return (
    <div className={ classes }>
      <input
        className="layout-input"
        type="text"
        name="query"
        placeholder={ placeholder }
        onKeyUp={ handleEnter }
        defaultValue={ searchy }
        onChange={ (e) => props.handleChange(e.target.value) } />
      <button onClick={ goToSearch }><Search size={16} /></button>
    </div>
  )
}
