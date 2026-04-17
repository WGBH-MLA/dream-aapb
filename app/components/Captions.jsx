export default function Captions(props){
  return <track kind="captions" srclang="en" label="English" default="default" src={ props.captionURL } />
}
