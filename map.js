'use strict'

console.log('Loaded map.js')

mapboxgl.accessToken = 'pk.eyJ1IjoiYnJpYW5ob3VzZSIsImEiOiJXcER4MEl3In0.5EayMxFZ4h8v4_UGP20MjQ'

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/brianhouse/cjnvuuqiy3fei2rnrhg0bbjpw',
    center: [-73.96216,40.80779],
    zoom: 16,
    attributionControl: false
})

let navigation = new mapboxgl.NavigationControl({
    showCompass: false
})
map.addControl(navigation, 'top-left')


let geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserLocation: true,
    fitBoundsOptions: {
    }
})
map.addControl(geolocate, 'top-left')

let point_1 = null
let point_2 = null

var el1 = document.createElement('div')
el1.className = 'marker'
let marker_1 = new mapboxgl.Marker(el1)

var el2 = document.createElement('div')
el2.className = 'marker'
let marker_2 = new mapboxgl.Marker(el2)


geolocate.on('geolocate', function(event) {
    point_1 = [event.coords.longitude, event.coords.latitude]
    marker_1.setLngLat(point_1)
    marker_1.addTo(map)    
    if (point_1 != null && point_2 != null) {
        updateGeoJSON([point_1, point_2])
    }        
})


// for testing purposes, also update the variable whenever you click on the map
map.on('click', function(event) {
    point_2 = [event.lngLat.lng, event.lngLat.lat]
    marker_2.setLngLat(point_2) 
    marker_2.addTo(map)
    if (point_1 != null && point_2 != null) {
        updateGeoJSON([point_1, point_2])
    }
})

var geojson = {
    "type": "FeatureCollection",
    "features": []
}

map.on('load', function() {
    map.addLayer({
        'id': 'drawing',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': geojson
        },
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#50C3DF',
            'line-width': 10,
            // 'line-opacity': .8
        }
    })


})

function startGeoJSON() {
    geojson.features.push({
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": []
        }
    })
}

function updateGeoJSON(points) {
    geojson.features[geojson.features.length - 1].geometry.coordinates = points
    map.getSource('drawing').setData(geojson)
}

startGeoJSON()


