import { AccessTypes } from "../utils/AccessTypes"
import { geocode } from "../utils/geocode"

export default class Location {
  constructor(country_code, region){
    this.country_code = country_code
    this.region = region
  }

  static async getGeocode(request){
    let ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip")
    if (!ip){
      ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-client-ip")
    }
    
    var country_code, region
    if(process.env.NODE_ENV === "development"){
      // allow all records viewable in dev
      this.region = AccessTypes.LOCATION_ONSITE
    } else if(ip && ip !== undefined) {
      country_code = await geocode(ip)
      region = codeToRegion(country_code)
    }

    return new Location(country_code, region)
  }
}

function codeToRegion(country_code){
  switch(country_code){
    case "US":
      return AccessTypes.LOCATION_USA
      break
    default:
      // if cant find ip from request, inconclusive geocode, or non-usa geocode, be strict
      return AccessTypes.LOCATION_GLOBAL
  }
}
