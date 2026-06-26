export default class Geocoding {
  constructor(ip){
    this.ip = ip
    this.country_code = locationByIP(ip)
  }

  async locationByIP(ip){
    fetch(`http://ip-api.com/json/${ip}`, (resp) => {
      
    })
  }
}


// http://ip-api.com/json/24.48.0.1