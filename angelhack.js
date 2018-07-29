'use strict';

const baseUrl = "https://cdmbtzfa7a.execute-api.us-west-1.amazonaws.com/production"
const locationsPath = "/bike/locations"
const dropoffPath = "/bike/dropoff"
const markerImagePath = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'

var map;

function getDropoffLocation() {
    fetch(baseUrl + dropoffPath, {
        method: "POST"
    }).then((response) =>
        response.json().then((circle) => {
            new google.maps.Circle({
                      strokeColor: '#0000FF',
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: '#0000FF',
                      fillOpacity: 0.35,
                      map: map,
                      center: {lat: circle.latitude, lng: circle.longitude},
                      radius: circle.radius
                    })
        })
    )
}

function populateMapWithLocations(map) {
    let icon = {
        url: "Htatic/bike1.png"
    };
    return (response) => {
        response.json().then((positions) => {
            let markers = []
            for (let position of positions) {
                markers.push(new google.maps.Marker({
                    position: {
                        lat: position.latitude,
                        lng: position.longitude
                    },
                    icon: icon,
                    map: map
                }));
            }
            let markerCluster = new MarkerClusterer(
                map,
                markers,
                {
                    imagePath: markerImagePath
                }
            );
        });
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.77960, lng: -122.429322},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        clickableIcons: false,
        zoom: 15,
        styles: [
            {
                featureType: "poi",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "administrative",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "transit",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ]
    });

    fetch(baseUrl + locationsPath).then(populateMapWithLocations(map));
}
