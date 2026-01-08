import { useState } from 'react'
import { ExternalLink, Search, X } from 'lucide-react'

export default function LayoutSearch(props){
  const [search, setSearch] = useState("")
  function goToSearch(){
    if(props.searchFilter){
      window.location.href = `/catalog?${ props.esIndex }[query]=${search}&${props.searchFilter}`
    } else {
      window.location.href = `/catalog?${ props.esIndex }[query]=${search}`
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
      <input onKeyUp={ (e) => handleEnter(e) } onChange={ (e) => setSearch(e.target.value) } type="text" name="query" placeholder={ placeholder } />
      <button onClick={ goToSearch }><Search size={16} /></button>
    </div>
  )
}
