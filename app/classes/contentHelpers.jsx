import { decode } from "html-entities"
export function renderBlocks(blocks){
  return blocks.map((block) => renderBlock(block))
}

function renderBlock(block){
  switch(block.type) {
    case "text":
      return renderBlockText(block)
    case "credits":
      return renderBlockCredits(block)  
  }
}

function renderBlockText(block){
  return dangerousDiv(block.value)
}

function renderBlockCredits(block){
  return (
    <div>
      Credits:
      { dangerousDiv(block.value) }
    </div>
  )
}

export function dangerousDiv(content){
  return (
    <div className="basic-block" dangerouslySetInnerHTML={{ __html: decode(content) }} />
  )
}