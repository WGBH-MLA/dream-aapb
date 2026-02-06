import { useState } from 'react'
import { useLoaderData, Form } from 'react-router'

import LayoutSearch from "../components/LayoutSearch"
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
import randomThumb from "../utils/randomThumb"

export const loader = async () => {
  return null
}

export const action = async ({request}) => {
  const body = await request.formData()
  fetch("https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=1e1d2c08-4d17-48c2-be2f-15eaaaf25e5f", {method: "POST", body: body}).then((resp) => {
    // setExists(resp.ok ? EXIST : NOTEXIST)
    console.log( 'i tried it!!', resp )
  }).catch((err) => {
    // setExists(NOTEXIST)
    console.log( 'i failed it!!' )
  })
}

export default function Subscribe() {
  let data = useLoaderData()
  const [email, setEmail] = useState(null)

  return (
    <>
      <div className="homepage-search">
        Please enter your email address to stay up to date with the latest AAPB news and events! 
        <div>
          <Form name="iterable_optin" target="_blank" method="POST" className="form-signup" data-list="general" data-placement-id="footer">
            <h2>Subscribe to the American Archive of Public Broadcasting mailing list.</h2>
            <input type="hidden" id="recaptcha_response" name="recaptcha_response" class="recaptcha-response" />
            <input class="success-page" type="hidden" name="success_page" value="/about-the-american-archive/newsletter_thanks" />
            <div class="indicates-required">
              <span class="asterisk">*</span> indicates required
            </div>
            <div class="iterable-field-group">
              <label>Email Address<span class="asterisk">*</span></label>
              <input class="form-input" type="text" name="email" size="24" onfocus="if(this.value===this.defaultValue){this.value='';}" onblur="if(this.value===''){this.value=this.defaultValue;}" placeholder="Email Address" required />
            </div>
            <div class="iterable-field-group">
              <label>First Name</label>
              <input class="form-input" type="text" name="firstName" size="24" onfocus="if(this.value===this.defaultValue){this.value='';}" onblur="if(this.value===''){this.value=this.defaultValue;}" placeholder="First Name" />
            </div>
            <div class="iterable-field-group">
              <label>Last Name</label>
              <input class="form-input" type="text" name="lastName" size="24" onfocus="if(this.value===this.defaultValue){this.value='';}" onblur="if(this.value===''){this.value=this.defaultValue;}" placeholder="Last Name" />
            </div>
            <div class="iterable-field-group">
              <label>How did you hear about the American Archive of Public Broadcasting?</label>
              <input class="form-input" type="text" name="hearAbout" size="24" onfocus="if(this.value===this.defaultValue){this.value='';}" onblur="if(this.value===''){this.value=this.defaultValue;}" placeholder="How did you hear about the American Archive of Public Broadcasting?" />
            </div>
            <input type="submit" value="Sign Up" class="button" />
          </Form>
        </div>
      </div>
    </>
  )
}



{/*
<div className="layout-search">
  <input type="text" placeholder="Email Address" onChange={ (e) => setEmail(e.target.value) }  />
  <button onClick={() => subscribe(email) }>Submit</button>
</div>*/}