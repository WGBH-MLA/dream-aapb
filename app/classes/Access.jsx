import { AccessTypes } from "../utils/AccessTypes"
import { truth } from "../utils/helpers"

// const GLOBAL = 0
// const USA = 1
// const ONSITE = 2

// const ACCESS_RESTRICTED = 0
// const ACCESS_ONLOCATION = 1
// const ACCESS_ONLINE = 2

// import VideoPlayer from "../components/VideoPlayer"
// import HeaderBar from "../components/HeaderBar"
// import ShowBox from "../components/ShowBox"
// import TranscriptViewer from "../components/TranscriptViewer"

export default class Access {
  constructor(record, location){
    this.record = record
    this.location.region = location
  }

  canPlay() {
    console.log( 'I go to funcy' )
    if( truth(this.record.access_level) ){
      console.log( 'its true, access!' )

      if(this.location.region >= AccessTypes.LOCATION_USA){
        console.log( 'usa, usa, usa' )
        if(this.record.access_level === AccessTypes.ACCESS_ONLINE){
          console.log( 'its ORR bitch' )
          return true
        } else if(this.record.access_level === AccessTypes.ACCESS_ONLOCATION && this.location.region === AccessTypes.LOCATION_ONSITE){
          console.log( 'its onsite bitch' )
          return true
        }
      }
    }
  }
}
