import { redirect } from "react-router"
import { AccessTypes } from "../utils/AccessTypes"
import { truth } from "../utils/helpers"
import { sessionStorage } from "../session.server.jsx"
import { requireAgreement } from "../session.server"

export default class Access {
  constructor(request, record, location){
    this.request = request
    this.record = record
    this.location = location
  }

  canPlay() {
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

  async hasAgreed(){
    return await requireAgreement(this.request)
  }

  // does anything below need to be moved to session.server.jsx to stay off client??
  static async setAgreement(request, affirm=true){
    const session = await sessionStorage.getSession()
    session.set("aapbAccess", affirm)
    return redirect(request.url, {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    })
  }

  static async clearAgreement(request){
    return await setAgreement(request, false)
  }

  static async agree(request){
    return await Access.setAgreement(request, true)
  }
}
