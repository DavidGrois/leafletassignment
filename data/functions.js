function trimTrailingSpaces(str) {
  return str.replace(/\s+$/, '')
}

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

  console.log('length: ', map.size)

  var mapsorted = new Map([...map.entries()].sort((a, b) => b[1] - a[1]))

  console.log(mapsorted)
  // console.log(...map.entries())
  // console.log(map)
}

function groupData(signData, intensityTotal, intensity, options) {
  // group data in: Vorrang geben, Kennzeichnung eines Schutzweg (Fußgängerübergang), Kinder, Zonenbeschränkung (30) merged with Ende der Zonenbeschränkung (30)
  return [
    L.heatLayer(convertToHeatmapFormat(signData, intensityTotal), options),
    L.heatLayer(DataOfType(signData, 'Vorrang geben', intensity), options),
    L.heatLayer(
      DataOfType(signData, 'Halten und Parken verboten', intensity),
      options
    ),
    L.heatLayer(
      DataOfType(
        signData,
        'Kennzeichnung eines Schutzweg (Fußgängerübergang)',
        intensity
      ),
      options
    ),
    L.heatLayer(DataOfType(signData, 'Kinder', intensity), options),
    L.heatLayer(
      DataOfType(signData, 'Zonenbeschränkung (30)', intensity).concat(
        DataOfType(signData, 'Ende der Zonenbeschränkung (30)', intensity)
      ),
      options
    )
  ]
}

function DataOfType(data, type, intensity) {
  var arr = []
  data.features.forEach((sign) => {
    if (trimTrailingSpaces(sign.properties.VZBEZ) == type) {
      var coords = sign.geometry.coordinates
      arr.push([coords[1], coords[0], intensity])
    }
  })
  return arr
}

function convertToHeatmapFormat(input, intensity) {
  return input.features.map(function (feature) {
    var coords = feature.geometry.coordinates
    return [coords[1], coords[0], intensity]
  })
}
