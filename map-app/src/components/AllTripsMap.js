import React, {useRef, useEffect, useState} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { accessToken} from "./tokens";

function AllTripsMap({locations, onMarkerEvent, locationsClickedStatus, location, includeZoom = false, initialZoomLevel, onTripsPage, retrievingLocations}) {
    mapboxgl.accessToken = accessToken;
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-89.9);
    const [lat, setLat] = useState(35);
    const [locationMarkersObj, setLocationMarkersObj] = useState({})
    const [globalTimeout, setGlobalTimeout] = useState(null)
    const [locationCoordinateList, setLocationCoordinateList] = useState([])
    const [zoom, setZoom] = useState(2)
    const [lastTimeout, setLastTimeout] = useState(null)
    const [currentLocations, setCurrentLocations] = useState(locations)
    const pixelWidthOfPage = onTripsPage ? document.getElementById('allTripsMap')?.clientWidth : document.getElementById('viewTripMap')?.clientWidth
    const pixelHeightOfPage = onTripsPage ? document.getElementById('allTripsMap')?.clientWidth : document.getElementById('viewTripMap')?.clientHeight

    useEffect(() => {
        if (location) {
            if (globalTimeout) {
                clearTimeout(globalTimeout);
            }
            let updatedTimeout = setTimeout(function () {
                fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${accessToken}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.features) {
                            setLng(data.features[0].center[0])
                            setLat(data.features[0].center[1])
                            map.current.flyTo({
                                center: {
                                    lng: data.features[0].center[0],
                                    lat: data.features[0].center[1]
                                }
                            });
                        }
                    })
            }, 500)
            setGlobalTimeout(updatedTimeout)
        }
    }, [location])

    useEffect(() => {
        if (locations) {
            locations.forEach(location => {
                const marker = locationMarkersObj[location]
                if (marker) {
                    let markerElement = marker.getElement();
                    let markerFill
                    if (locationsClickedStatus[location]) {
                        markerFill = '#FF0000'
                    } else {
                        markerFill = '#3FB1CE'
                    }
                    markerElement
                        .querySelectorAll('path')[0]
                        .setAttribute("fill", markerFill)
                }
            })
        }
    }, [locationsClickedStatus])
    useEffect(() => {
        if (locations && locations.length !== currentLocations.length) {
            setCurrentLocations(locations)
            for (const locationMarker in locationMarkersObj) {
                if (!locations.includes(locationMarker)) {
                    locationMarkersObj[locationMarker].remove()
                }
            }
            const markersObj = {}
            const locationCoordinates = []
            console.log("fetching locations")
            console.log(locations)
            locations.forEach((activityLocation, index) => {
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${activityLocation}.json?access_token=${accessToken}`)
                .then(response => response.json())
                .then(data => {
                    if (data.features) {
                        const coordinates = {
                            lng: data.features[0].center[0],
                            lat: data.features[0].center[1]
                        }
                        locationCoordinates.push(coordinates)
                        if (index === (locations.length - 1)) {
                            console.log("setting location coordinate list")
                            setLocationCoordinateList(locationCoordinates)
                        }

                        const marker = new mapboxgl.Marker()
                            .setLngLat(coordinates)
                            .addTo(map.current);
                        addListenersToMarker(marker, activityLocation)
                        markersObj[activityLocation] = marker
                    }
                })
            })
            setLocationMarkersObj(markersObj)
        }
    }, [locations])

    useEffect(() => {
        console.log(locationCoordinateList)
        if (includeZoom && locationCoordinateList && lng && lat) {
            clearTimeout(lastTimeout)
            const timeout = setTimeout(() => {
                getZoom()
            }, 1000)
            setLastTimeout(timeout)
        }
    }, [locationCoordinateList, pixelWidthOfPage])

    const getZoom = () => {
        if (pixelWidthOfPage) {
            const zoom15 = 2.389
            const zoomMap = {
                15: zoom15
            }
            for (let i = 14; i >= 0; i--) {
                zoomMap[i] = zoom15 * Math.pow(2, (15 - i))
            }
            console.log(zoomMap)
            const latLngDistanceFromCenterList = locationCoordinateList.map(coordinate => {
                return {
                    lng: Math.abs(Math.abs(coordinate.lng) - Math.abs(lng)),
                    lat: Math.abs(Math.abs(coordinate.lat) - Math.abs(lat))
                }
            })
            let zoomChoice
            const zoomArray = latLngDistanceFromCenterList.map(coordinateDistance => {
                const latDistanceInMeters = coordinateDistance.lat * 111139
                const lngDistanceInMeters = coordinateDistance.lng * 111139
                for (let i = 15; i > 0; i--) {
                    let zoomWidthInMeters = (zoomMap[i] * pixelWidthOfPage) / 2
                    let zoomHeightInMeters = (zoomMap[i] * pixelHeightOfPage) / 2
                    if (lngDistanceInMeters < zoomWidthInMeters && latDistanceInMeters < zoomHeightInMeters) {
                        return i
                    }
                }
            })
            if (zoomArray?.length > 0 && !retrievingLocations) {
                console.log(locations)
                console.log("done retrieving locatins, lets zoom!")
                const zoomLevel = Math.min(...zoomArray)
                if (zoom !== zoomLevel) {
                    setZoom(zoomLevel)
                    console.log("setting zoom level to : " + zoomLevel)
                    setTimeout(() => {
                        map.current.setZoom(zoomLevel)

                    }, 2000)
                }
            }
        }
    }

    function addListenersToMarker(marker, location) {
        const markerDiv = marker.getElement();
        markerDiv.addEventListener('click', () => onMarkerEvent( location))
    }

    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: initialZoomLevel,
        });
    });

    return (
        <div id={onTripsPage ? 'allTripsMap' : 'viewTripMap'}>
            <div ref={mapContainer} className="map-container" style={{height: 400}}/>
        </div>
    );
}

export default AllTripsMap;