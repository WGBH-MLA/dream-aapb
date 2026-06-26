import { AccessTypes } from "../utils/AccessTypes"

export default class Location {
  constructor(request){
    this.request = request
    this.region = fakeGeocoding(this.request.ip)
  }
}

function fakeGeocoding(ip){
  if(ip){
    return AccessTypes.LOCATION_USA
  } else {
    return AccessTypes.LOCATION_GLOBAL    
  }
}
