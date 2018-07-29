'use strict';

const baseUrl = "https://cdmbtzfa7a.execute-api.us-west-1.amazonaws.com/production"
const locationsPath = "/bike/locations"
const dropoffPath = "/bike/dropoff"
const markerImagePath = 'static/bike_small_'

var map;
var directionsService;
var directionsDisplay;
var fromPlacesService;
var toPlacesService;

function calculateRoute(dropoff) {
	let request = {
		origin: {
			placeId: fromPlacesService.getPlace().place_id
		},
		destination: {
			placeId: toPlacesService.getPlace().place_id
		},
		waypoints: [
			{
				location: {
					lat: dropoff.latitude,
					lng: dropoff.longitude
				},
				stopover: true
			}
		],
		travelMode: google.maps.TravelMode.BICYCLING
	}

	directionsService.route(request, (response, status) => {
		if (status == "OK") {
			directionsDisplay.setDirections(response);
		}
	})
}

function getDropoffLocation() {
    fetch(baseUrl + dropoffPath, {
        method: "POST",
		latitude: toPlacesService.getPlace().geometry.location.lat,
		longitude: toPlacesService.getPlace().geometry.location.lng
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
                    });
			calculateRoute(circle);
        })
    )
}

function populateMapWithLocations(map) {
    let icon = {
        url: "static/bike1.png",
        scaledSize: new google.maps.Size(50, 50)
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
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

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

	directionsDisplay.setMap(map);

	fromPlacesService = new google.maps.places.Autocomplete(document.getElementById('origin-search'));
	toPlacesService = new google.maps.places.Autocomplete(document.getElementById('dest-search'));
}
