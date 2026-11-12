import { Form } from "react-router"
import orrese from "../data/orrese"

export default function Agreement(props){
  return (
    <div className="agreement">
      <Form method="POST">

        <div className="logo">
          <img src="/aapbsquare.png" />
        </div>

        <div className="blurb">
          Welcome to the American Archive of Public Broadcasting Online Reading Room (ORR). To access media in the ORR, please review and agree to the ORR Rules of Use:
        </div>

        <div className="scrolling">
          { orrese }
        </div>

        <div className="agree">
          <button className="sidebar-search-button" type="submit" name="agreement" value="true">Agree</button>
          <button style={{display: "none"}} className="sidebar-search-button" type="submit" name="agreement" value="false">Disagree</button>  
        </div>
      </Form>
    </div>
  )
}
