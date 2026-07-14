import { AccessTypes } from "../utils/AccessTypes"
import { geocode } from "../utils/geocode"

export default class Location {
  constructor(request){
    this.request = request
    let ip = this.request.ip
    if(process.env.NODE_ENV === "development"){
      this.region = AccessTypes.LOCATION_ONSITE
    } else if(ip && ip !== undefined) {
      this.country_code = geocode(ip)
      this.region = codeToRegion(this.country_code) || AccessTypes.LOCATION_USA
    }

  }
}

function codeToRegion(country_code){
//   switch country_code
//   case "US:
//     return AccessTypes.LOCATION_USA
// }

// function fakeGeocoding(ip){
//   if(ip){
//     return AccessTypes.LOCATION_USA
//   } else {
//     return AccessTypes.LOCATION_GLOBAL
//   }
}
