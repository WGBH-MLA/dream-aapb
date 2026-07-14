import { AccessTypes } from "../utils/AccessTypes"
import { truth } from "../utils/helpers"

export default class Access {
  constructor(record, location){
    this.record = record
    this.location = location
  }

  canPlay() {
    // console.log( 'I go to funcy', this.record, this.location )
    if( truth(this.record.access_level) ){
      // console.log( 'its true, access!' )

      if(this.location.region >= AccessTypes.LOCATION_USA){
        // console.log( 'its usa' )
        if(this.record.access_level === AccessTypes.ACCESS_ONLINE){
          // console.log( 'its ORR' )
          return true
        } else if(this.record.access_level === AccessTypes.ACCESS_ONLOCATION && this.location.region === AccessTypes.LOCATION_ONSITE){
          // console.log( 'its onsite' )
          return true
        }
      }
    }
  }
}
