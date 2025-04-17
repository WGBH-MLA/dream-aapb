import { ExternalLink, Search, X } from 'lucide-react'

export default function LayoutSearch(props){
  

  return (
    <div className="layout-search">
      <input type="text" name="query" placeholder="Search the Archive" />
      <button><Search size={16} /></button>
    </div>
  )
}