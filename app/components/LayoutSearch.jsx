import { useEffect } from "react"
import { ExternalLink, Search, X } from "lucide-react"

export default function LayoutSearch(props){
  var encodedQuery = encodeURIComponent(props.searchQuery || "")
  // useEffect(() => {
  //   if(!props.searchQuery && props.queryFromURL && props.queryFromURL.length > 0 && props.queryFromURL != searchy){
  //     searchy = props.queryFromURL
  //   }
  // })

  function goToSearch(){
    let resource
    if(window.location.pathname.includes("/catalog") && !window.location.pathname.includes("/catalog/")){
      // different handling because we're already on the path (/catalog) we want to go to!
      resource = "recatalog"
    } else {
      resource = "catalog"
    }

    let destination
    if(props.searchFilter){
      destination = `/${resource}?${ props.esIndex }[query]=${encodedQuery}${props.searchFilter}`
    } else {
      destination = `/${resource}?${ props.esIndex }[query]=${encodedQuery}`
    }

    props.navigateHook(destination)
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
        defaultValue={ encodedQuery }
        onChange={ (e) => props.handleChange(e.target.value) } />
      <button onClick={ goToSearch }><Search size={24} /></button>
    </div>
  )
}
