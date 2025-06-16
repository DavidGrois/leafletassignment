//creating the map; defining the location in the center of the map (geographic coords) and the zoom level
var map = L.map('map', {
  center: [47.8035, 13.049],
  zoom: 13
})

// add stadia map as base layer
var osmap = L.tileLayer(
  'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
  {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
  }
).addTo(map)

// debugging/data exploration function
// inspectData(data)

const options = {
  radius: 15,
  blur: 12,
  minOpacity: 0.3,
  gradient: {
    0.5: '#008450',
    0.8: '#EFB700',
    1.0: '#B81D13'
  }
}
var layers = groupData(data, 0.65, 0.8, options)

layers[0].addTo(map)

L.control.scale({ position: 'bottomright', imperial: false }).addTo(map)

var buttons = ['all', 'vorrang', 'halten', 'zebra', 'halt', 'zone']

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

// adds outline of salzburg, fillOpacity 0 for only outline
var outline = L.geoJson(salzburg, {
  color: '#222',
  weight: 3,
  opacity: 0.5,
  fillOpacity: 0
}).addTo(map)

// Not adding a layer control, as the sign buttons are the layer control and activating multiple heatlayers does not merge the data. it just makes it unreadable
// var features = {
//   'all Signs': layers[0],
//   Vorrang: layers[1],
//   Fußgängerübergang: layers[2],
//   Halt: layers[3],
//   '30ger Zone': layers[4]
// }

// var layerControl = L.control
//   .layers(null, features, { position: 'bottomleft' })
//   .addTo(map)

const drawn = L.featureGroup().addTo(map) // holds the rectangle
const points = L.featureGroup().addTo(map)

const drawCtl = new L.Control.Draw({
  draw: {
    rectangle: { shapeOptions: { color: '#222' } },
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
  const active = document.getElementsByClassName('active')[0].id
  var coords = []
  switch (active) {
    case 'all':
      coords = layers[0]._latlngs
      break
    case 'vorrang':
      coords = layers[1]._latlngs
      break
    case 'halten':
      coords = layers[2]._latlngs
      break
    case 'zebra':
      coords = layers[3]._latlngs
      break
    case 'halt':
      coords = layers[4]._latlngs
      break
    case 'zone':
      coords = layers[5]._latlngs
      break
    default:
      coords = layers[0]._latlngs
      break
  }
  const b = e.layer.getBounds()
  const hits = coords.filter((c) => b.contains([c[0], c[1]])).length

  L.popup()
    .setLatLng(b.getCenter())
    .setContent(
      `${hits.toLocaleString('de-AT')} Straßenschild${
        hits !== 1 ? 'er' : ''
      } in diesem Gebiet`
    )
    .openOn(map)
})
