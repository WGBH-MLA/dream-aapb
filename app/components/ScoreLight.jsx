// import { useLocation } from '@remix-run/react'

export default function ScoreLight(props) {
  let color = "#ddd"
  let score = parseFloat(props.score)
  if(score){
    if(score > 1 && score < 9){
      color =  "#ffa"
    } else if(score >= 9){
      color = "#afa"
    }
  }
  return (
    <div style={{ backgroundColor: color }} className='score-light' />
  )
}
