export default class Record {
  // view helper class for common pbcore stuff
  constructor(data){
    this.data = data
    if(!this.data || !this.data.guid){
      console.log( 'problemsss', props )
      // throw "Input data invalid for Record!!"
    }

    // accessors that actually get used in this class
    this.guid = this.data.guid
    this.pbcoreDescriptionDocument = this.data.pbcoreDescriptionDocument
    this.media_type = this.data.media_type

    if( this.data.pbcoreDescriptionDocument && this.data.pbcoreDescriptionDocument.pbcoreIdentifier && this.data.pbcoreDescriptionDocument.pbcoreIdentifier.length > 0){
      let ciIDNode = this.data.pbcoreDescriptionDocument.pbcoreIdentifier.find((pbi) => pbi.source === "Sony Ci")
      if(ciIDNode){
        this.ciID = ciIDNode.text
      }
    } else {
      this.ciID = null
    }

  }

  // helper methods
  isAudio(){
    return this.data.media_type == "Sound"
  }

  isVideo(){
    return this.data.media_type == "Moving Image"
  }
}

