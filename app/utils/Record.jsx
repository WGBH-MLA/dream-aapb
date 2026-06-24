export default class Record {
  // view helper class for common pbcore stuff
  constructor(data){
    // this is the entire es document v
    this.data = data

    if(!this.data || !this.data.guid){
      throw `Input data invalid for Record!! ${data}`
    }

    // accessors that actually get used in this class (keep the properties limited to stuff getting called on the view for cleanness)
    this.guid = this.data.guid
    this.pbcoreDescriptionDocument = this.data.pbcoreDescriptionDocument
    this.media_type = this.data.media_type
    this.title = this.data.title
    this.producing_org = this.data.producing_org


    this.access_level = "private"
    if(this.data.pbcoreDescriptionDocument.pbcoreAnnotation && this.data.pbcoreDescriptionDocument.pbcoreAnnotation.length > 0){
      let levelAnnotation = this.data.pbcoreDescriptionDocument.pbcoreAnnotation.find((pba) => pba.annotationType === "Level of User Access")
      if(levelAnnotation && levelAnnotation.text){
        switch(levelAnnotation.text){
          case "Online Reading Room":
            this.access_level = "online"
          case "On Location":
            this.access_level ="onlocation"
          case "Private":
            this.access_level = "private"
        }
      }
    }

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
      // aapb currently takes the first description only, obv we can show more if we want
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

  instantiations(){
    if(this.pbcoreDescriptionDocument && this.pbcoreDescriptionDocument.pbcoreInstantiation && this.pbcoreDescriptionDocument.pbcoreInstantiation.length > 0){
      return this.pbcoreDescriptionDocument.pbcoreInstantiation.map((pbi) => new Instantiation(pbi))
    }
  }
}



class Instantiation {
  constructor(instantiation){

    this.identifiers = instantiation.instantiationIdentifier && instantiation.instantiationIdentifier.length > 0 ? instantiationIdentifier.map((id) => new Identifier(id))
    this.generation =
    this.color =
    this.duration =
    
    // presence of instdig or instphys
    if(instantiation.instantiationDigital){
      this.format = "digital"
      this.format_description = instantiation.instantiationDigital.text
    } else if(instantiation.instantiationPhysical){
      this.format = "physical"
      this.format_description = instantiation.instantiationPhysical.text
    }

  }
}

class Element {
  constructor(element){
    // 90% of pb subelements have overlapping attributes

    if(element.text){
      this.text = element.text
    }

    if(element.ref){
      this.ref = element.ref
    }

    if(element.version){
      this.version = element.version
    }

    if(element.annotation){
      this.annotation = element.annotation
    }

    if(element.source){
      this.source = element.source
    }

  }
}


