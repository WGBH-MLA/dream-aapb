import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'

import usStates from '../data/usStates.json'
import orgs from '../data/orgs.json'

export default function Mappy(props) {
  // aggregate by state oh great
  let orgsByState = {}
  Object.keys(orgs).forEach(org_id => {
    let org = orgs[org_id]
    org.id = org_id
    let state = org.State
    if (!orgsByState[state]) {
      orgsByState[state] = {}
    }
    orgsByState[state][org_id] = org
  })

  const stateStyle = {
    fillColor: '#7c147c',
    weight: 1,
    color: '#ccc',
    dashArray: 3,
    fillOpacity: 0.5,
  }

  var sdata
  // var mapData = orgsByState.values.map( () )
  var mapFeatures = usStates.features.map(stateFeature => {
    stateFeature.style = stateStyle
    return stateFeature
  })
  sdata = {
    type: 'FeatureCollection',
    features: mapFeatures,
  }

  var markers = []
  Object.values(orgsByState).map(orgsInState => {
    Object.keys(orgsInState).map(orgId => {
      let org = orgs[orgId]
      let logo =
        org.Logo ?
          <img
            src={`https://s3.amazonaws.com/americanarchive.org/org-logos/${org.Logo}`}
            className='mappy-logo'
          />
        : null
      markers.push(
        <Marker position={{ lat: org.location[0], lng: org.location[1] }}>
          <Popup>
            <a href={`/organizations/${orgId}`} target='_blank' class='org-url'>
              <h3>{org.Name}</h3>
            </a>
            <div>
              {org.City}, {org.State}
            </div>
            {logo}
            <a
              href='/search?orgsid?????todo'
              target='_blank'
              class='btn btn-default btn-sm'>
              View all records
            </a>
          </Popup>
        </Marker>
      )
    })
  })

  return (
    <>
      <MapContainer center={[37.8, -130]} zoom={2.5}>
        <TileLayer
          attribution={`Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors`}
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <GeoJSON data={sdata} />
        {markers}
      </MapContainer>
    </>
  )
}
