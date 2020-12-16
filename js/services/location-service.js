import { storageService } from './storage-service.js'

const gLocations = [];

export const locationService = {
    getLocations,
    cachedData,
    deleteLocation,
    getLatLng,
    getCityLatLng,
    gLocations,
}

const LOCATION_KEY = 'user_location'
var gId = 101;

function getLocations() {
    return Promise.resolve(gLocations);
}


function getCityLatLng(addressText) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressText}&key=AIzaSyCKuaufnbpG6KWdX28y4gBz43wMxdjEa54`)
        .then(res => {
            return res.data
        });
}

function cachedData(locationName, lat, lng, created) {
    gLocations.push(createLocation(locationName, lat, lng, created, gId));
    gId++;
    storageService.saveToStorage(LOCATION_KEY, gLocations);
}

function createLocation(locationName, lat, lng, created, id) {
    return {
        locationName,
        lat,
        lng,
        created,
        id,
    }
}

function getLatLng(idx) {
    var location = gLocations.find((row) => row.id === parseInt(idx))
    return ({ lat: location.lat, lng: location.lng })

}

function deleteLocation(idx) {
    console.log('gLocations is:', gLocations);
    var locationIndex = gLocations.findIndex((row) => row.id === parseInt(idx))
    console.log('idxDelete is:', locationIndex);
    gLocations.splice(locationIndex, 1);
}


