import { getCiMediaURL } from "../utils/media"
export default class VideoHound {
  constructor(config){
    if(!config){
      throw "Did not receive sony ci CONFIG!!"
    }

    if(!config.ciAPIHost || !config.ciWorkspaceId || !config.ciUser || !config.ciPassword || !config.ciClientId || !config.ciClientSecret){
      throw "Ack, missing ci vars, I'm BROKEN!"
    }

    this.config = config
  }
  
  async findMedia(ciRecordId, isVideo) {
    let resp = await getCiMediaURL(this.config, ciRecordId, isVideo)
    if(resp && resp.complete && resp.complete.length > 0 && resp.complete[0] && resp.complete[0].streams && resp.complete[0].streams.length > 0 && resp.complete[0].streams[0] && resp.complete[0].streams[0].url){
      return resp.complete[0].streams[0].url
    }
  }
}
