export default function SocialIcon(props){
  return (
    <a href={props.url}>
      <div className="social-icon">
        <img src={ props.icon } />
      </div>
    </a>
  )
}