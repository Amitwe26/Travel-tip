import { storageService } from './storage-service.js'

const gLocations = [];

export const locationService = {
    getLocations,
    cachedData,
    deleteLocation,
    gLocations,
}

const LOCATION_KEY = 'user_location'
var gId = 101;

function getLocations() {
    return Promise.resolve(gLocations);
}

function cachedData(locationName, lat, lng, created) {
    gLocations.push(createLocation(locationName, lat, lng, created, gId));
    gId++
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

function deleteLocation(idx) {
    console.log('idx:', idx);
    var idxDelete = gLocations.findIndex((location) => {
        return location.id === idx
    })
    gLocations.splice(idxDelete, 1);
}


