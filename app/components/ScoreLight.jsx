// import { useLocation } from '@remix-run/react'

export default function ScoreLight(props) {
  let color = "#ddd"
  let score = parseFloat(props.score)
  if(score){
    if(score > 1 && score < 9){
      color =  "#ff0"
    } else if(score >= 9){
      color = "#0f0"
    }
  }
  return (
    <div style={{ backgroundColor: color }} className='score-light' />
  )
}
