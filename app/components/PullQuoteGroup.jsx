import { useState } from 'react'

export default function PullQuoteGroup(props){
  const [display, setDisplay] = useState(0)

  let quotes
  if(props.quotes){
    quotes = props.quotes
  }

  function displayQuote(quoteIndex, length){
    quoteIndex = quoteIndex < 0 ? length-1 : quoteIndex
    quoteIndex = quoteIndex == length ? 0 : quoteIndex
    setDisplay(quoteIndex)
  }

  let bubbles = quotes.map((quote,i) => {
    if(display == i){
      return <div className="pull-quote-group-bubble fill" />
    } else {
      return <div className="pull-quote-group-bubble" />
    }
  })

  return (
    <div className="pull-quote-group-container">
      <div onClick={ () => displayQuote(display-1, quotes.length) } className="pull-quote-group-button">&lt;</div>
      
      <div className="pull-quote-group-quote">
        { quotes[display] }
      </div>

      <div onClick={ () => displayQuote(display+1, quotes.length) } className="pull-quote-group-button">&gt;</div>

      <div className="pull-quote-group-bubbles">
        { bubbles }
      </div>
    </div>
  )
}