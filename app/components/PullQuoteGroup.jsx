import { useState } from 'react'

export default function PullQuoteGroup(props){
  const [display, setDisplay] = useState(0)

  const quotes = props.quotes || []

  function displayQuote(quoteIndex, length){
    quoteIndex = quoteIndex < 0 ? length - 1 : quoteIndex
    quoteIndex = quoteIndex === length ? 0 : quoteIndex
    setDisplay(quoteIndex)
  }

  const bubbles = quotes.map((quote, i) => (
    <div key={i} className={`pull-quote-group-bubble${display === i ? ' fill' : ''}`} />
  ))

  return (
    <div className="pull-quote-group-container">
      <div className="pull-quote-row">
        <div onClick={() => displayQuote(display - 1, quotes.length)} className="pull-quote-group-button">&#8249;</div>
        <div className="pull-quote-group-quote">
          { quotes[display] }
        </div>
        <div onClick={() => displayQuote(display + 1, quotes.length)} className="pull-quote-group-button">&#8250;</div>
      </div>
      <div className="pull-quote-group-bubbles">
        { bubbles }
      </div>
    </div>
  )
}