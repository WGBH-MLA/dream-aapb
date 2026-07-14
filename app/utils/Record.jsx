import { AccessTypes } from "../utils/AccessTypes"
import { notEmpty } from "../utils/helpers"

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
    if(notEmpty(this.data.pbcoreDescriptionDocument.pbcoreAnnotation)){
      let levelAnnotation = this.data.pbcoreDescriptionDocument.pbcoreAnnotation.find((pba) => pba.annotationType === "Level of User Access")
      if(levelAnnotation && levelAnnotation.text){

        switch(levelAnnotation.text){
          case "Online Reading Room":
            this.access_level = AccessTypes.ACCESS_ONLINE
            break
          case "On Location":
            this.access_level = AccessTypes.ACCESS_ONLOCATION
            break
          case "Private":
            this.access_level = AccessTypes.ACCESS_RESTRICTED
            break
        }
      }
    }

    if(notEmpty(this.pbcoreDescriptionDocument.pbcoreIdentifier)){
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
    if(this.pbcoreDescriptionDocument.pbcoreDescription && this.pbcoreDescriptionDocument.pbcoreDescription[0] && this.pbcoreDescriptionDocument.pbcoreDescription[0].text){
      // aapb currently takes the first description only, obv we can show more if we want
      return this.pbcoreDescriptionDocument.pbcoreDescription[0].text
    } else {
      return "No Description Available"
    }
  }

  creators(){
    // all creators other than producing organization
    if(notEmpty(this.pbcoreDescriptionDocument.pbcoreCreator)){
      return this.pbcoreDescriptionDocument.pbcoreCreator.filter((pbc) => pbc.creator && notEmpty(pbc.creatorRole) && pbc.creatorRole[0].text && pbc.creatorRole[0].text != "Producing Organization")
    }
  }

  instantiations(){
    if(notEmpty(this.pbcoreDescriptionDocument.pbcoreInstantiation)){
      return this.pbcoreDescriptionDocument.pbcoreInstantiation.map( (pbi) => new Instantiation(pbi) )
    }
  }
}

class Instantiation {
  constructor(instantiation){

    this.identifiers = notEmpty(instantiation.instantiationIdentifier) ? instantiation.instantiationIdentifier.map((id) => new Element(id)) : null
    // current fields displayed on old aapb instantiations:
    // format
    // generations 
    // color
    // duration
    
    // presence of instdig or instphys
    if(instantiation.instantiationDigital){
      this.format = "Digital"
      this.format_description = instantiation.instantiationDigital.text
    } else if(instantiation.instantiationPhysical){
      this.format = "Physical"
      this.format_description = instantiation.instantiationPhysical.text
    } else {
      this.format = "Unknown"
    }

    if(notEmpty(instantiation.instantiationIdentifiers)){
      this.identifiers = instantiation.instantiationIdentifiers.map((ii) => new Element(ii))
    }

    if(notEmpty(instantiation.instantiationGenerations)){
      this.generations = instantiation.instantiationGenerations.map((ig) => new Element(ig))
    }

    if(notEmpty(instantiation.instantiationColors)){
      this.colors = instantiation.instantiationColors.map((ic) => new Element(ic))
    }

    if(notEmpty(instantiation.instantiationDuration)){
      this.durations = instantiation.instantiationDuration.map((id) => new Element(id))
    }

  }

  blurb(){
    let identifiers, generations, colors, durations
    if(this.identifiers){
      identifiers = <div className="smarbot"><b>Identifiers:</b> <ul>{this.identifiers.map( (g) => <li>{g.source} - { g.text }</li>)}</ul></div>
    }
    if(this.generations){
      generations = <div className="smarbot"><b>Generations:</b> <ul>{this.generations.map( (g) => <li>{ g.text }</li>)}</ul></div>
    }
    if(this.colors){
      colors = <div className="smarbot"><b>Colors:</b> <ul>{this.colors && this.colors.map( (c) => <li>{ c.text }</li>)}</ul></div>
    }
    if(this.durations){
      durations = <div className="smarbot"><b>Duration:</b> <ul>{this.durations && this.durations[0].map( (d) => <li>{ d.text }</li>)}</ul></div>
    }
    
    return (
      <div className="instantiation-blurb martop">
        <div className="smarbot"><b>Format:</b> { this.format }</div>
        <div className="smarbot"><b>Format Description:</b> { this.format_description }</div>
        { identifiers }
        { generations }
        { colors }
        { durations }
      </div>
    )
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


