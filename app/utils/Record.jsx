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
    this.topics = this.data.topics
    this.contributing_orgs = this.data.contributing_orgs

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

  aspectRatio(){
    let inst = this.instantiations()
    let aspectInst = inst.find((i) => i.aspect_ratio)
    if(aspectInst){
      return aspectInst.aspect_ratio
    }
  }

  is169(){
    return this.isVideo() && (this.aspectRatio() == "1.778" || this.aspectRatio() == "16:9")
  }

  is43(){
   return this.isVideo() && (this.aspectRatio() == "1.333" || this.aspectRatio() == "4:3")
  }

  description(){
    if(this.pbcoreDescriptionDocument.pbcoreDescription && this.pbcoreDescriptionDocument.pbcoreDescription[0] && this.pbcoreDescriptionDocument.pbcoreDescription[0].text){
      return this.pbcoreDescriptionDocument.pbcoreDescription[0].text
    } else {
      return "No Description Available"
    }
  }

  descriptionsByType(){
    if(this.pbcoreDescriptionDocument.pbcoreDescription && notEmpty(this.pbcoreDescriptionDocument.pbcoreDescription)){
      return this.pbcoreDescriptionDocument.pbcoreDescription.sort((a,b) => { a.descriptionType.localeCompare(b.descriptionType) })
    }
  }

  titlesByType(){
    if(this.pbcoreDescriptionDocument.pbcoreTitle && notEmpty(this.pbcoreDescriptionDocument.pbcoreTitle)){
      return this.pbcoreDescriptionDocument.pbcoreTitle.sort((a,b) => { a.titleType.localeCompare(b.titleType) })
    }
  }

  people(){
    let people = []
    // all people other than producing organization
    if(notEmpty(this.pbcoreDescriptionDocument.pbcoreCreator)){
      people = this.pbcoreDescriptionDocument.pbcoreCreator.filter((pbc) => pbc.creator && pbc.creator.text && notEmpty(pbc.creatorRole) && pbc.creatorRole[0].text && pbc.creatorRole[0].text != "Producing Organization")
    }

    return people
  }

  creators(){
    let creators = []
    if(notEmpty(this.pbcoreDescriptionDocument.pbcoreCreator)){
      creators = this.pbcoreDescriptionDocument.pbcoreCreator.filter((pbc) => pbc.creator && pbc.creator.text && notEmpty(pbc.creatorRole) && pbc.creatorRole[0].text)
    }

    return creators
  }

  contributors(){
    let contributors = []
    if(notEmpty(this.pbcoreDescriptionDocument.pbcoreContributor)){

      contributors = this.pbcoreDescriptionDocument.pbcoreContributor.filter((pbc) => pbc.contributor && pbc.contributor.text && notEmpty(pbc.contributorRole) && pbc.contributorRole[0].text)
    }

    return contributors
  }

  publishers(){
    let publishers = []
    if(notEmpty(this.pbcoreDescriptionDocument.pbcorePublisher)){
      publishers = this.pbcoreDescriptionDocument.pbcorePublisher.filter((pbc) => pbc.publisher && notEmpty(pbc.publisher.text) && notEmpty(pbc.publisherRole) && pbc.publisherRole[0].text)
    }

    return publishers
  }

  credits(){
    let creators = this.creators()
    let contributors = this.contributors()
    let publishers = this.publishers()
    return creators.concat(contributors, publishers)
  }

  instantiations(){
    if(notEmpty(this.pbcoreDescriptionDocument.pbcoreInstantiation)){
      return this.pbcoreDescriptionDocument.pbcoreInstantiation.map( (pbi) => new Instantiation(pbi) ).filter((pbi) => pbi.organization != "American Archive of Public Broadcasting")
    }
  }

  allInstantiations(){
    if(notEmpty(this.pbcoreDescriptionDocument.pbcoreInstantiation)){
      return this.pbcoreDescriptionDocument.pbcoreInstantiation.map( (pbi) => new Instantiation(pbi) )
    }
  }

  duration(){
    let inst = this.allInstantiations()
    if(notEmpty(inst)){
      let duration
      // check for proxy duration
      for(var i=0; i<inst.length; i++){
        if(notEmpty(inst[i].generations)){
          if(inst[i].generations.find((ig) => ig.text == "Proxy") && notEmpty(inst[i].essence_tracks)){
            let ess = inst[i].essence_tracks.find((ess) => ess.essenceTrackDuration)
            if(ess){
              return ess.essenceTrackDuration.text
            }
          }
        }
      }

      // check for any duration
      for(var i=0; i<inst.length; i++){
        if(notEmpty(inst[i].essence_tracks)){
          let durEss = inst[i].essence_tracks.find((ess) => ess.essenceTrackDuration)
          if(durEss){
            // ;P
            return durEss.essenceTrackDuration.text
          }
        }
      }
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
    
    if(notEmpty(instantiation.instantiationEssenceTrack)){
      // TODO: finish ess class
      // this.essence_tracks = instantiation.instantiationEssenceTrack.map((ess) => new EssenceTrack(ess))
      this.essence_tracks = instantiation.instantiationEssenceTrack
    }

    if(notEmpty(this.essence_tracks)){
      let aspectEssenceTrack
      aspectEssenceTrack = this.essence_tracks.find((ess) => ess.essenceTrackAspectRatio && ess.essenceTrackAspectRatio.text)
      if(aspectEssenceTrack){
        this.aspect_ratio = aspectEssenceTrack.essenceTrackAspectRatio.text
      }
    }

    if(notEmpty(instantiation.instantiationAnnotation)){
      let orgAnnotation = instantiation.instantiationAnnotation.find((ia) => ia.annotationType === "organization")
      if(orgAnnotation){
        this.organization = orgAnnotation.text
      }
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

// class EssenceTrack {
//   constructor(ess){
//     // TODO: coming soon
//   }
// }

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
