import SocialIcon from "./SocialIcon"

export default function ToeNail(props){
  return (
    <div className="toenail-bar">
      {/*gloss only*/}
      
      <div className="toenail-logos">
        A collaboration:
        <img src="/gbh.png" />
        <img src="/loc.png" />
      </div>

      <div className="toenail-socials">
        <SocialIcon icon="/silly.png" />
        <SocialIcon icon="/silly.png" />
        <SocialIcon icon="/silly.png" />
        <SocialIcon icon="/silly.png" />
        <SocialIcon icon="/silly.png" />
      </div>
    </div>
  )
}