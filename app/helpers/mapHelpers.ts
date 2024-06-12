import { MARKER_SCALE, MARKER_STROKE_COLOR, MARKER_STROKE_WEIGHT } from "../config/constants";

// Helper function to compute the distance between two locations
export const computeDistance = (loc1: google.maps.LatLng, loc2: google.maps.LatLng): number => {
    return google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2);
};

// Helper function to create a marker icon with a specified color
export const markerIcon = (color: string) => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    scale: MARKER_SCALE,
    strokeColor: MARKER_STROKE_COLOR,
    strokeWeight: MARKER_STROKE_WEIGHT,
});

// Helper function to find the nearest location
const findNearestLocation = (
    currentIndex: number,
    unvisitedIndices: number[],
    allLocations: google.maps.LatLng[]
): { nearestIndex: number, minDistance: number } => {
    let nearestIndex = -1;
    let minDistance = Infinity;

    for (let index of unvisitedIndices) {
        const distance = computeDistance(allLocations[currentIndex], allLocations[index]);
        if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = index;
        }
    }

    return { nearestIndex, minDistance };
};

// Function implementing the nearest neighbor algorithm
export const nearestNeighbor = (
    startIndex: number,
    unvisited: number[],
    allLocations: google.maps.LatLng[]
): number[] => {
    let currentLocationIndex = startIndex;
    const route = [currentLocationIndex];
    let remainingLocations = [...unvisited];

    while (remainingLocations.length > 0) {
        const { nearestIndex } = findNearestLocation(currentLocationIndex, remainingLocations, allLocations);

        if (nearestIndex !== -1) {
            route.push(nearestIndex);
            remainingLocations.splice(remainingLocations.indexOf(nearestIndex), 1);
            currentLocationIndex = nearestIndex;
        } else {
            break;
        }
    }

    return route;
};
