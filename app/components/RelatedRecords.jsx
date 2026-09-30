import Record from "../utils/Record"
import NiceItem from "./NiceItem"

export default function RelatedRecords(props){
  let records = props.records ? props.records.map((record) => new Record(record)) : []
  let niceItems = records.map((record) => {
    return <NiceItem 
      guid={ record.guid } 
      itemURL={ `/catalog/${ record.guid }` } 
      title={ record.title }
      classes={ ["marleft"] }
    />
  })
  return (
    <div className="related-records">
      <div className="related-records-content smartop">
        { niceItems }
      </div>
    </div>
  )
}
