export default class Record {
  // view helper class for common pbcore stuff
  constructor(data){
    // this is the entire es document v
    this.data = data

    if(!this.data || !this.data.guid){
      throw "Input data invalid for Record!!"
    }

    // accessors that actually get used in this class (keep the properties limited to stuff getting called on the view for cleanness)
    this.guid = this.data.guid
    this.pbcoreDescriptionDocument = this.data.pbcoreDescriptionDocument
    this.media_type = this.data.media_type
    this.title = this.data.title
    this.producing_org = this.data.producing_org

    if( this.pbcoreDescriptionDocument && this.pbcoreDescriptionDocument.pbcoreIdentifier && this.pbcoreDescriptionDocument.pbcoreIdentifier.length > 0){
      let ciIDNode = this.pbcoreDescriptionDocument.pbcoreIdentifier.find((pbi) => pbi.source === "Sony Ci")
      if(ciIDNode){
        this.ciID = ciIDNode.text
      }
    }
  }

  // helper methods
  isAudio(){
    return this.data.media_type == "Sound"
  }

  isVideo(){
    return this.data.media_type == "Moving Image"
  }

  hasPlayableMedia(){
    return ( this.isVideo() || this.isAudio() ) && this.ciID && this.ciID.length > 0
  }
  
  description(){
    if(this.pbcoreDescriptionDocument && this.pbcoreDescriptionDocument.pbcoreDescription && this.pbcoreDescriptionDocument.pbcoreDescription[0] && this.pbcoreDescriptionDocument.pbcoreDescription[0].text){
      // aapb currently takes the first description only, obv we can show more if we ant
      return this.pbcoreDescriptionDocument.pbcoreDescription[0].text
    } else {
      return "No Description Available"
    }
  }

  creators(){
    // all creators other than producing organization
    if(this.pbcoreDescriptionDocument && this.pbcoreDescriptionDocument.pbcoreCreator && this.pbcoreDescriptionDocument.pbcoreCreator.length > 0){
      return this.pbcoreDescriptionDocument.pbcoreCreator.filter((pbc, i) => pbc.creator && pbc.creatorRole && pbc.creatorRole.text && pbc.creatorRole.text != "Producing Organization")
    }
  }
}
