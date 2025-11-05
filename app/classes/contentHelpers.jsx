import { decode } from "html-entities"
export function renderBlocks(blocks){
  return blocks.map((block, i) => renderBlock(block, i))
}

function renderBlock(block, key){
  switch(block.type) {
    case "text":
      return renderBlockText(block, key)
    case "credits":
      return renderBlockCredits(block, key)
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