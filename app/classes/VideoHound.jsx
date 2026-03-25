import { getCiMediaURL } from "../utils/media"
export default class VideoHound {
  constructor(props){
    console.log( 'hooray!!' )
    if(!props.ciConfig){
      throw "Did not receive sony ci config!!"
    }

    if(!props.ciConfig.ciAPIHost || !props.ciConfig.ciWorkspaceId || !props.ciConfig.ciUser || !props.ciConfig.ciPassword || !props.ciConfig.ciClientId || !props.ciConfig.ciClientSecret){
      throw "Ack, missing ci vars, I'm UPSET!"
    }

    this.ciConfig = props.ciConfig
  }
  
  public async findMedia() {
    let mediaURL = await getCiMediaURL(this.ciConfig)
    return mediaURL
  }
}

// let scrug = {
//   sheesh() {
//     return "any floating function inside like this can be called like scrug.sheesh() - not bad!"
//   }
// }
