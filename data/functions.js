// for some reason all the strings in the roadsign geoJson have lots of spaces added to the end of them
// this removes said spaces
function trimTrailingSpaces(str) {
  return str.replace(/\s+$/, '')
}

// for logging specific parts of the data to make it easier to find the interessting parts
// for example it counts how many signs there are, or how many of a given sign
// not relevant/not used for the map rendering
function inspectData(data) {
  var map = new Map()

  data.features.forEach((signData) => {
    var sign = trimTrailingSpaces(signData.properties.VZBEZ)
    if (map.has(sign)) {
      map.set(sign, map.get(sign) + 1)
    } else {
      map.set(sign, 1)
    }
  })

  // console.log('length: ', map.size)

  var mapsorted = new Map([...map.entries()].sort((a, b) => b[1] - a[1]))

  // console.log(mapsorted)
  // console.log(...map.entries())
  // console.log(map)
}

// this creates an array of heatlayers, coding it this way makes it more readable. it is an array, and not an object, because i need to iterate through the layers when changing which layer is active
// first layer contains all data, all others contain specific signs matched to the VZNR of the geoJson features, which is basically the ID of every type of sign (i think)
// intensity and options are given to the function when its called in main.js
function groupData(signData, intensityTotal, intensity, options) {
  // group data in: Vorrang geben, Kennzeichnung eines Schutzweg (Fußgängerübergang), Halt, Zonenbeschränkung (30) merged with Ende der Zonenbeschränkung (30)
  return [
    L.heatLayer(convertToHeatmapFormat(signData, intensityTotal), options),
    L.heatLayer(DataOfType(signData, '52-23', intensity), options),
    L.heatLayer(DataOfType(signData, '52-13b', intensity), options),
    L.heatLayer(DataOfType(signData, '53-02a', intensity), options),
    L.heatLayer(DataOfType(signData, '52-24', intensity), options),
    L.heatLayer(
      DataOfType(signData, '52-11b_01', intensity).concat(
        DataOfType(signData, '52-11a_01', intensity)
      ),
      options
    )
  ]
}

function DataOfType(data, type, intensity) {
  var arr = []
  // loop through data, match with VZNR, if match safe latitude longitude in array with intensity
  data.features.forEach((sign) => {
    if (trimTrailingSpaces(sign.properties.VZNR) == type) {
      var coords = sign.geometry.coordinates
      // the data in the geoJson seems to be longitude then latitude, the heatlayers want latitude then longitude. which is why the coords[1] is before coords[0]
      arr.push([coords[1], coords[0], intensity])
    }
  })
  return arr
}

// gets the coordinates of every feature of the geoJson and saves them in an array readable by the L.heatlayer() function
function convertToHeatmapFormat(input, intensity) {
  return input.features.map(function (feature) {
    var coords = feature.geometry.coordinates
    return [coords[1], coords[0], intensity]
  })
}
