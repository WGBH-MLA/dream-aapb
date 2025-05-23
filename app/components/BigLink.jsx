import { ExternalLink } from 'lucide-react'
export default function BigLink(props){
  return (
    <div className="biglink marbot">
      <a href={props.url}>
        <ExternalLink size={64} />
        <div>
          <h3>{props.title}</h3>
          { props.text }
        </div>
      </a>
    </div>
  )
}