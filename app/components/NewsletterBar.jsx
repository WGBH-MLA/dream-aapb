import { useState } from 'react'
export default function NewsletterBar(props){
  const [email, setEmail] = useState(null)
  function goToSubscribe(){
    window.location.href = `/subscribe?email=${email}`
  }
  return (
    <div className="newsletter-bar">
      <div>
        Join the AAPB mailing list.
      </div>
      <div>
        <input onChange={ (e) => setEmail(e.target.value) } placeholder="Enter your email address" type="text" />
        <input onClick={ goToSubscribe } type="submit" value="Subscribe" />
      </div>
    </div>
  )
}
