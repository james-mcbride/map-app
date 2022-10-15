import React, {useRef, useEffect, useState} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

function AllTripsMap({locations}) {
    const accessToken = 'pk.eyJ1IjoiamFtZXMtbWNicmlkZSIsImEiOiJja2lqMHhudGEwdmtyMnJsY2VodHpkdmE1In0.q2A-peliF2vmbST01Es9TA';
    mapboxgl.accessToken = accessToken;
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-89.9);
    const [lat, setLat] = useState(35);
    const [zoom, setZoom] = useState(2);
    console.log(locations);
    useEffect(() => {
        if (locations) {
            locations.forEach(location => {
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${accessToken}`)
                .then(response => response.json())
                .then(data => {
                    if (data.features) {
                        // setLng(data.features[0].center[0])
                        // setLat(data.features[0].center[1])
                        const marker = new mapboxgl.Marker()
                            .setLngLat({
                                lng: data.features[0].center[0],
                                lat: data.features[0].center[1]
                            })
                            .addTo(map.current);
                        const markerDiv = marker.getElement();
                        markerDiv.addEventListener('mouseenter', () => console.log("hovered over location: " + location))
                        markerDiv.addEventListener('mouseleave', () => console.log("ended hover over location: " + location))
                        markerDiv.addEventListener('click', () => {
                            console.log("clicked on location: " + location)
                        })

                    }
                })
            })
        }
    }, [locations])


    // const marker = new mapboxgl.Marker().setLngLat().addTo(map)

    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
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