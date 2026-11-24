import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'

import usStates from '../data/usStates.json'
import orgs from '../data/orgs.json'

const stateSlug = (state) =>
  `state-${state.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

export default function ClientMap(props) {
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
    dashArray: '3',
    fillOpacity: 0.5,
  }

  const onEachState = (feature, layer) => {
    const stateName =
      feature.properties?.name ||
      feature.properties?.NAME ||
      feature.properties?.state

    if (!stateName) return

    const matchedLink = props.stateLinks?.find(
      (s) => s.name.toLowerCase() === stateName.toLowerCase()
    )
    const targetId = matchedLink
      ? matchedLink.href.replace(/^#/, "")
      : stateSlug(stateName)

    layer.on({
      click: () => {
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
          window.history.replaceState(null, "", `#${targetId}`)
        } else {
          window.location.hash = `#${targetId}`
        }
      },
      mouseover: (e) => {
        e.target.setStyle({
          fillOpacity: 0.75,
          weight: 2,
        })
      },
      mouseout: (e) => {
        e.target.setStyle(stateStyle)
      },
    })
  }

  const markers = []
  Object.values(orgsByState).forEach(orgsInState => {
    Object.keys(orgsInState).forEach((orgID, i) => {
      const org = orgs[orgID]
      if (!org.location || org.location.length < 2) return

      const orgName = org["Short name"] || org.Name
      const logo = org.Logo ? (
        <img
          src={`https://s3.amazonaws.com/americanarchive.org/org-logos/${org.Logo}`}
          alt={`${orgName} logo`}
          className='mappy-logo'
        />
      ) : null

      markers.push(
        <Marker key={orgID + i} position={{ lat: org.location[0], lng: org.location[1] }}>
          <Popup>
            <a href={`/organizations/${orgID}`} target='_blank' rel='noreferrer' className='org-url'>
              <h3>{orgName}</h3>
            </a>
            <div>
              {org.City}, {org.State}
            </div>
            {logo}
            <a
              href={`/catalog?organization_id=${orgID}`}
              target='_blank'
              rel='noreferrer'
              className='btn btn-default btn-sm'>
              VIEW ALL RECORDS
            </a>
          </Popup>
        </Marker>
      )
    })
  })

  return (
    <>
      <MapContainer scrollWheelZoom={false} center={[50, -105]} zoom={2.5} style={{ height: "650px", width: "85%"}}>
        <TileLayer
          attribution={`Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors`}
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <GeoJSON
          data={usStates}
          style={stateStyle}
          onEachFeature={onEachState}
        />
        {markers}
      </MapContainer>
    </>
  )
}