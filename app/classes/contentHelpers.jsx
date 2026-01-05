import { decode } from "html-entities"
import AAPBRecord from "../components/AAPBRecord"

export function renderBlocks(blocks){
  return blocks.map((block, i) => renderBlock(block, i))
}

function renderBlock(block, key){
  switch(block.type) {
    // standard uncustomized block types
    case "text":
      return renderBlockText(block, key)
    // blcoks with some kind of special rendering
    case "credits":
      return renderBlockCredits(block, key)
    case "funders":
      return renderBlockFunders(block, key)
    case "help":
      return renderBlockHelp(block, key)
    case "background":
      return renderBlockBackground(block, key)
    case "resources":
      return renderBlockResources(block, key)
    case "aapb_record":
      return renderBlockAAPBRecord(block, key)
    case "terms":
      return renderBlockTerms(block, key)
    case "heading":
      return renderBlockHeading(block, key)
    case "subheading":
      return renderBlockSubheading(block, key)
    case "records":
      // noop
      return ""
    default:
      return `This is the block you got. ${block.type}`
  }
}

function renderBlockText(block, key){
  return (
      <div key={ key }>
        { dangerousDiv(block.value) } 
      </div>
   )
}

function renderBlockCredits(block, key){
  return (
    <div key={key}>
      <h2 className="smarbot">Credits</h2>
      { dangerousDiv(block.value) }
    </div>
  )
}

function renderBlockFunders(block, key){
  return (
    <div key={key}>
      <h2>Resources</h2>
      { dangerousDiv(block.value) }
    </div>
  )
}

function renderBlockHelp(block, key){
  return (
    <div className="help-block marbot" key={key}>
      { dangerousDiv(block.value, false) }
    </div>
  )
}

function renderBlockBackground(block, key){
  return (
    <div key={key}>
      <h2 className="smarbot">Background</h2>
      { dangerousDiv(block.value) }
    </div>
  )
}

function renderBlockResources(block, key){
  return (
    <div key={key}>
      <h2 className="smarbot">Resources</h2>
      { dangerousDiv(block.value) }
    </div>
  )
}

function renderBlockAAPBRecord(block, key){
  return (
    <AAPBRecord key={key} guid={ block.guid } showTitle={block.showTitle} showThumbnail={block.showThumbnail} pbcore={ block.pbcore } title={ block.title } wide={ block.wide } startTime={block.start_time} endTime={block.end_time} />
  )
}

function renderBlockTerms(block, key){
  return (
    <div className="terms-block" key={key}>
      <h2 className="smarbot">Key Terms<span>(Click a term to search for related records)</span></h2>
      { dangerousDiv(block.value) }
    </div>
  )
}

function renderBlockHeading(block, key){
  return (
    <div className="heading-block smarbot" key={key}>
      { dangerousDiv(block.value, false) }
    </div>
  )
}

function renderBlockSubheading(block, key){
  // if(block.value.includes?('href="/exhibits/')){
  //   console.log( 'uh oh!' )
  // }


  return (
    <div className="subheading-block smarbot" key={key}>
      { dangerousDiv(block.value, false) }
    </div>
  )
}

export function dangerousDiv(content, basic=true){
  return (
    <div suppressHydrationWarning={true} className={ basic ? "block basic-block" : "block" } dangerouslySetInnerHTML={{ __html: decode(content) }} />
  )
}



function tempFixLinks(content){
  // go through each a and check for amarchive.org/exhibits/slug link, chabgne to new slugs
  // return decode( content.map((b) => b.) )

}
