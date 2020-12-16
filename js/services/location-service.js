import { localStorage } from './storage-service'

export const locationService = {
    getLocations,
    cachedData
}

const LOCATION_KEY = 'user_location'
var id = 101;

const gLocations = [{ lat: 17, lng: 19, name: 'Puki Home' }];

function getLocations() {
    return Promise.resolve(gLocations)
}

function cachedData(locationName, lat, lng, created) {
    saveToStorage(key, [{ locationName, lat, lng, created }])
}