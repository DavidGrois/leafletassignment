// Using Leaflet for creating the map and adding controls for interacting with the map

//
//--- Part 1: adding base maps ---
//

//creating the map; defining the location in the center of the map (geographic coords) and the zoom level. These are properties of the leaflet map object
//the map window has been given the id 'map' in the .html file
var map = L.map('map', {
  center: [47.8035, 13.049],
  zoom: 14
})

//adding base map/s

// add open street map as base layer
var osmap = L.tileLayer(
  'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}@2x.png',
  {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
  }
).addTo(map)

// for using the two base maps in the layer control, I defined a baseMaps variable
var baseMaps = {
  'Open Street Map': osmap
}

// var totalHeatData = data.features.map(function (feature) {
//   var coords = feature.geometry.coordinates
//   return [coords[1], coords[0], 0.45]
// })

// inspectData(data)

const options = {
  radius: 23,
  blur: 12,
  minOpacity: 0.23
}
var layers = groupData(data, 0.65, 0.8, options)

layers[0].addTo(map)

L.control.scale({ position: 'bottomright', imperial: false }).addTo(map)

var buttons = ['all', 'vorrang', 'halten', 'zebra', 'kinder', 'zone']

buttons.forEach((btnId, i) => {
  const button = document.getElementById(btnId)
  button.onclick = () => {
    layers.forEach((l) => map.removeLayer(l))
    buttons.forEach((id) =>
      document.getElementById(id).classList.remove('active')
    )
    map.addLayer(layers[i])
    button.classList.add('active')
  }
})

// Not adding a layer control, as the sign buttons are the layer control and activating multiple heatlayers does not merge the data. just makes it unreadable
// var features = {
//   'all Signs': layers[0],
//   Vorrang: layers[1],
//   Fußgängerübergang: layers[2],
//   Kinder: layers[3],
//   '30ger Zone': layers[4]
// }

// var layerControl = L.control
//   .layers(null, features, { position: 'bottomleft' })
//   .addTo(map)

// TODO: add legend, or a ? button with explanaition. maybe drag rectangle mark then count signs inside

const drawn = L.featureGroup().addTo(map) // holds the rectangle
const points = L.featureGroup().addTo(map)

const drawCtl = new L.Control.Draw({
  draw: {
    rectangle: { shapeOptions: { color: '#00A0E4' } },
    polygon: false,
    circle: false,
    polyline: false,
    marker: false,
    circlemarker: false
  },
  edit: false
})
map.addControl(drawCtl)

map.on(L.Draw.Event.CREATED, (e) => {
  const b = e.layer.getBounds()
  const hits = data.features.filter((c) =>
    b.contains([c.geometry.coordinates[1], c.geometry.coordinates[0]])
  ).length

  L.popup()
    .setLatLng(b.getCenter())
    .setContent(`${hits} point${hits !== 1 ? 's' : ''} in area`)
    .openOn(map)
})
