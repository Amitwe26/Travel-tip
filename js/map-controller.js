
import { locationService } from './services/location-service.js'

console.log('locationService', locationService);

var myLatlng = { lat: 32.0749831, lng: 34.9120554 };

var gGoogleMap;


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

    getUserPosition()
        .then(pos => { })
        .catch(err => {
            console.log('err!!!', err);
        })

    document.querySelector('.btn').addEventListener('click', (ev) => {
        panTo(35.6895, 139.6917);
    })
    const elBtnDelete = Array.from(document.querySelectorAll('.delete'))
    console.log('elbtn', elBtnDelete);
    elBtnDelete.forEach(elBtn => {
        elBtn.addEventListener('click', ev => {
            const locationId = ev.target.dataset.id;
            console.log('loc id', locationId);
            locationService.deleteLocation(locationId)
            renderTable(locationService.gLocations)
        })
    })

}


export function initMap(lat = 32.0749831, lng = 34.9120554) {
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
        title: 'Hello World!'
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
    const API_KEY = 'AIzaSyCKuaufnbpG6KWdX28y4gBz43wMxdjEa54'; //TODO: Enter your API Key
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
       <td>${location.locationName}</td>
       <td>${location.lat.toFixed(2)}</td>
       <td>${location.lng.toFixed(2)}</td>
       <td><button class="btn-render go">Go to location</button></td>
       <td><button data-id="${location.id}" class="btn-render delete">Delete</button></td>
       </tr>`
    })
    document.querySelector('.table').innerHTML = strHtml.join('');
}



