import { AccessTypes } from "../utils/AccessTypes"
import { Geocoding } from "../classes/Geocoding"

export default class Location {
  constructor(request){
    this.request = request

    let ip = this.request.ip
    if(process.env.NODE_ENV === "development"){
      this.region = AccessTypes.LOCATION_ONSITE
    } else {
      this.region = new Geocoding(ip)
    }

  }
}

function fakeGeocoding(ip){
  if(ip){
    return AccessTypes.LOCATION_USA
  } else {
    return AccessTypes.LOCATION_GLOBAL    
  }
}
