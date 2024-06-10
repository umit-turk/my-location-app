export const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 };
export const DEFAULT_ZOOM = 6;
export const MARKER_SCALE = 10;
export const MARKER_STROKE_COLOR = 'white';
export const MARKER_STROKE_WEIGHT = 2;
export const MARKER_COLOR = '#00F';
export const POLYLINE_COLOR = '#FF0000';
export const getMapContainerStyle = (width = '100%', height = '50vh') => ({
    width,
    height,
});

export const gridTemplateColumns = {
    base: '1fr',
    lg: 'repeat(2, 1fr)',
};

export const ROUTES = {
    ADD_LOCATION: {
        title: 'Add Location',
        route: '/add-location',
    },
    SHOW_LOCATIONS: {
        title: 'Show Locations',
        route: '/show-locations',
    },
    EDIT_LOCATION: {
        title: 'Edit Location',
        route: '/edit-location',
    },
    ROUTES_MAP: {
        title: 'Routes Map',
        route: '/routes-map',
    },
};
