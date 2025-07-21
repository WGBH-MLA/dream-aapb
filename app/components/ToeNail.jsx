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
        <SocialIcon url="https://www.youtube.com/channel/UCni4awAToTQjg9d1vW9w-8w" icon="/yt.png" />
        <SocialIcon url="https://www.instagram.com/amarchivepub/" icon="/ig.png" />
        <SocialIcon url="https://www.facebook.com/amarchivepub" icon="/fb.png" />
        <SocialIcon url="https://twitter.com/amarchivepub" icon="/tw.png" />
      </div>
    </div>
  )
}