import { MapContainer, TileLayer } from 'react-leaflet'
export default function Mappy(props){
  return (
    <div className="mappy-container">
      <MapContainer center={[37.8, -130]} zoom={2.5}>
        <TileLayer attribution={`Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors`} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  )
  
}
