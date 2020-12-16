import { localStorage } from './storage-service.js'

export const locationService = {
    getLocations,
    cachedData,
}

const gLocations = [{ locationName: 'Puki Home', lat: 17, lng: 19 }];
const LOCATION_KEY = 'user_location'
var id = 101;

function getLocations() {
    return Promise.resolve(gLocations);
}

function cachedData(locationName, lat, lng, created) {
    gLocations.push(createLocation(locationName, lat, lng, created));
    console.log('userLocations is:', gLocations);
    localStorage.saveToStorage(LOCATION_KEY, gLocations);
}

function createLocation(locationName, lat, lng, created) {
    return {
        locationName,
        lat,
        lng,
        created,
    }
}