import React, {useRef, useEffect, useState} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { accessToken} from "./tokens";

function AllTripsMap({locations, onMarkerEvent, locationsClickedStatus, location, includeZoom = false, initialZoomLevel, onTripsPage, retrievingLocations, viewingMultipleTrips}) {
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
                                },
                                duration: 1000,
                                animate: true
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
                    console.log("removing marker")
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
                if (viewingMultipleTrips) {
                    const newCenterCoordinates = setNewMapCenter()
                    getZoom(newCenterCoordinates)
                } else {
                    getZoom()
                }
            }, 1000)
            setLastTimeout(timeout)
        }
    }, [locationCoordinateList, pixelWidthOfPage, lng, lat])

    const setNewMapCenter = () => {
        const locationCoordinateListFiltered = locationCoordinateList.filter(coordinate => coordinate?.lat && coordinate?.lng)
        let middleLat = (Math.min(...locationCoordinateListFiltered.map(coordinate => coordinate.lat)) + Math.max(...locationCoordinateListFiltered.map(coordinate => coordinate.lat)))/2
        let middleLng = (Math.min(...locationCoordinateListFiltered.map(coordinate => coordinate.lng)) + Math.max(...locationCoordinateListFiltered.map(coordinate => coordinate.lng)))/2
        // locationCoordinateList.forEach(coordinates => {
        //     totalLat += coordinates.lat
        //     totalLng += coordinates.lng
        // })
        // const newCenterCoordinates = {
        //     lng: totalLng/locationCoordinateList.length,
        //     lat: totalLat/locationCoordinateList.length
        // }
        const newCenterCoordinates = {
            lat: middleLat,
            lng: middleLng
        }
        map.current.flyTo({
            center: newCenterCoordinates,
            animate:true,
            duration: 1000
        });
        return newCenterCoordinates
    }

    const getZoom = (newCenterCoordinates = null) => {
        console.log("setting zoom")
        if (pixelWidthOfPage) {
            const zoom15 = 2.389
            const zoomMap = {
                15: zoom15
            }
            for (let i = 14; i >= 0; i--) {
                zoomMap[i] = zoom15 * Math.pow(2, (15 - i))
            }
            console.log("test 1")
            const latLngDistanceFromCenterList = locationCoordinateList.map(coordinate => {
                return {
                    lng: Math.abs(Math.abs(coordinate.lng) - Math.abs(newCenterCoordinates ? newCenterCoordinates.lng : lng)),
                    lat: Math.abs(Math.abs(coordinate.lat) - Math.abs(newCenterCoordinates ? newCenterCoordinates.lat : lat))
                }
            })
            console.log("test 2")
            console.log("pixel height: " + pixelHeightOfPage)
            console.log("pixel width: " + pixelWidthOfPage)
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
            console.log("test 3")
            if (zoomArray?.length > 0 && !retrievingLocations) {
                zoomArray.forEach(zoomNum => console.log(zoomNum))
                console.log("test 4")
                const zoomLevel = Math.min(...zoomArray.filter(zoomNum => zoomNum))
                console.log("zoom level: " + zoomLevel)
                console.log(lng)
                console.log(lat)
                // const newZoom = newCenterCoordinates ? zoomLevel - 1 : zoomLevel
                if (zoom !== zoomLevel) {
                    setZoom(zoomLevel)
                    setTimeout(() => {
                        map.current.zoomTo(zoomLevel-.25, {duration: 1000, animate: true})
                    }, 500)
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
            <div ref={mapContainer} className="map-container"/>
        </div>
    );
}

export default AllTripsMap;