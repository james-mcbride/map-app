import React, {useRef, useEffect, useState} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { accessToken} from "./tokens";

function AllTripsMap({locations, onMarkerEvent, locationsClickedStatus, location, includeZoom = false, initialZoomLevel}) {
    mapboxgl.accessToken = accessToken;
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-89.9);
    const [lat, setLat] = useState(35);
    const [locationMarkersObj, setLocationMarkersObj] = useState({})
    const [globalTimeout, setGlobalTimeout] = useState(null)
    const [locationCoordinateList, setLocationCoordinateList] = useState([])
    const [zoom, setZoom] = useState(2)

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
        if (locations) {
            const markersObj = {}
            const locationCoordinates = []
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
                        addListenersToMarker(marker, location)
                        markersObj[location] = marker
                    }
                })
            })
            setLocationMarkersObj(markersObj)
        }
    }, [locations])

    useEffect(() => {
        console.log(locationCoordinateList)
        if (includeZoom && locationCoordinateList && lng && lat) {
            getZoom()
        }
    }, [locationCoordinateList])

    const getZoom = () => {
        const pixelWidthOfPage = document.getElementById('view-trip-header').clientWidth
        const pixelHeightOfPage = document.getElementById('view-trip-header').clientHeight
        const zoom15 = 2.389
        const zoomMap = {
            15: zoom15
        }
        for (let i =14; i>=0; i--) {
            zoomMap[i] = zoom15 * Math.pow(2, (15 -i))
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
            for (let i =15; i>0; i--){
                let zoomWidthInMeters = (zoomMap[i] * pixelWidthOfPage)/2
                let zoomHeightInMeters = (zoomMap[i] * pixelHeightOfPage)/2
                if (lngDistanceInMeters < zoomWidthInMeters && latDistanceInMeters < zoomHeightInMeters) {
                    return i
                }
            }
        })
        if (zoomArray?.length > 0) {
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
    if (map.current) {
        map.current.on("zoom", () => {
            console.log(map)
        })
    }

    return (
        <div>
            <div ref={mapContainer} className="map-container" style={{height: 400}}/>
        </div>
    );
}

export default AllTripsMap;