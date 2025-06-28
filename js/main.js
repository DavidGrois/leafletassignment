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

// options for the heatmaps, radius of the points, how blurred they are, opacity they should start with at base zoom
// gradient for the colors. i used green->yellow->red to imitate traffic light colors, as it fits the theme
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

// creates an array of heatmap layers, 0.65 and 0.8 are the intensity of the heat. 0.65 is for the layer with all data -> smaller value makes it readable
// 0.8 is the intensity for every other layer
var { layers, lengths } = groupData(data, 0.65, 0.8, options)

// adds the layer with all data to the map as the layer shown when opening the webpage
layers[0].addTo(map)
// adds the amount shown text for the inital layers
updateSignCount(lengths[0])

// adds a scale to the bottom left of the map
L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map)

// these are the IDs of the html buttons,
var buttons = ['all', 'vorrang', 'halten', 'zebra', 'halt', 'zone']

// iterating through the button ids, which assigns onclick listeners to display the clicked layer
// this is my layer control, i made my own version of a layer control for better usability and so that i can use sign images as buttons
// still adding the built-in layercontrol would allow users to activate multiple heat layers at once, which makes the map unreadable as this does not merge the data: they are just rendered on top of each other
buttons.forEach((btnId, i) => {
  const button = document.getElementById(btnId)
  button.onclick = () => {
    layers.forEach((l) => map.removeLayer(l))
    buttons.forEach((id) =>
      document.getElementById(id).classList.remove('active')
    )
    map.addLayer(layers[i])
    // updates count of signs in top right
    updateSignCount(lengths[i])
    button.classList.add('active')
  }
})

// adds outline of salzburg, fillOpacity 0 for just outline
// uses geojson data of the cities area
var outline = L.geoJson(salzburg, {
  color: '#222',
  weight: 3,
  opacity: 0.5,
  fillOpacity: 0
}).addTo(map)

// enables the draw control for the leaflet draw plugin, only allows drawing of a rectangle with a grey outline color
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

// a listener for the map itself which listens for a create event from the draw plugin
map.on(L.Draw.Event.CREATED, (e) => {
  // gets the ID of the active heatlayer button from an array of every html element with the active class (which should only every be 1 button)
  const active = document.getElementsByClassName('active')[0].id

  var coords = []

  // assigns the correct latitude longitude data arrays from the heatlayers to the coords variable which is later used to compute the amount of signs inside the rectangle
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

  // gets the shape data from the draw event, which fired when a user drew a rectangle. this gives us the coordinates of the rectangle in the map
  const bounds = e.layer.getBounds()

  // this checks every sign of the active layer, if a sign is inside the rectangle it gets stored in the return array of the filter function, the length of this array is the amount of signs inside the drawn rectangle
  const hits = coords.filter((c) => bounds.contains([c[0], c[1]])).length

  // adds a popup at the center of the drawn rectangle displaying the number of signs inside
  L.popup()
    .setLatLng(bounds.getCenter())
    .setContent(
      `${hits.toLocaleString('de-AT')} Straßenschild${
        hits !== 1 ? 'er' : ''
      } in diesem Gebiet`
    )
    .openOn(map)
})
