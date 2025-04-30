import { useState } from 'react'
import { ExternalLink, Search, X } from 'lucide-react'

export default function LayoutSearch(props){
  const [search, setSearch] = useState(null)
  function goToSearch(){
    window.location.href = `/search?aapb[query]=${search}`
  }

  function handleEnter(e){
    if(e.key == "Enter"){
      goToSearch()
    }
  }
 
  return (
    <div className="layout-search">
      <input onKeyUp={ (e) => handleEnter(e) } onChange={ (e) => setSearch(e.target.value) } type="text" name="query" placeholder="Search the Archive" />
      <button onClick={ goToSearch }><Search size={16} /></button>
    </div>
  )
}
