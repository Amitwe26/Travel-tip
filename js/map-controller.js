
import { locationService } from './services/location-service.js'

console.log('locationService', locationService);

var myLatlng = { lat: 32.0749831, lng: 34.9120554 };

var gGoogleMap;
const API_KEY = 'AIzaSyCKuaufnbpG6KWdX28y4gBz43wMxdjEa54'; //TODO: Enter your API Key


window.onload = () => {
    console.log('its here', locationService.gLocations);
    initMap()
        .then(() => {
            addMarker(myLatlng);
        })
        .then(() => {
            gGoogleMap.addListener("click", (ev) => {
                onMapClick(ev)
            });
        })
        .catch(console.log('INIT MAP ERROR'));
    document.querySelector(".my-location-btn").addEventListener('click', (ev) => {
        getUserPosition()
            .then(pos => {
                console.log('pos is:', pos);

                panTo(pos.coords.latitude, pos.coords.longitude);

            })
            .catch(err => {
                console.log('err!!!', err);
            })
    })

    document.querySelector('.btn-go').addEventListener('click', (ev) => {
        console.log('ev is:', ev);
        var elAddress = document.querySelector('input[type="text"]').value;
        console.log('elAddress is:', elAddress);
        var res = locationService.getCityLatLng(elAddress);
        console.log('result is:', res);
        //  panTo(35.6895, 139.6917);
    })

    document.querySelector(".my-location-btn").addEventListener('click', (ev) => {
        getUserPosition();
    });

}


export function initMap(lat = 29.549295, lng = 34.954120) {
    return _connectGoogleApi()
        .then(() => {
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            });
        })
}



function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'You are here!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
}

function getUserPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function onMapClick(ev) {
    var locationName = prompt("Enter place Name:");
    const lat = ev.latLng.lat();
    const lng = ev.latLng.lng();
    locationService.cachedData(locationName, lat, lng, Date.now())
    locationService.getLocations()
        .then((locations) => renderTable(locations));

}

function renderTable(locations) {
    var strHtml = locations.map((location) => {
        return `<tr>
        <td>${location.id}</td>
       <td>${location.locationName}</td>
       <td>${location.lat.toFixed(2)}</td>
       <td>${location.lng.toFixed(2)}</td>
       <td><button data-id="${location.id}" class="btn-render go">Go to location</button></td>
       <td><button data-id="${location.id}" class="btn-render delete">Delete</button></td>
       </tr>`
    })
    document.querySelector('.table').innerHTML = strHtml.join('');
    const elBtnGoto = Array.from(document.querySelectorAll('.go'));
    elBtnGoto.forEach(elBtn => {
        elBtn.addEventListener('click', ev => {
            console.log('ev is:', ev.target);
            const locationId = ev.target.dataset.id;
            var x = locationService.getLatLng(locationId);
            panTo(x.lat, x.lng);
            // renderTable(locationService.gLocations)
        })
    })


    const elBtnDelete = Array.from(document.querySelectorAll('.delete'));
    elBtnDelete.forEach(elBtn => {
        elBtn.addEventListener('click', ev => {
            const locationId = ev.target.dataset.id;
            locationService.deleteLocation(locationId)
            renderTable(locationService.gLocations)
        })
    })
}



