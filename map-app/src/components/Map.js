import React, {useRef, useEffect, useState} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { accessToken} from "./tokens";

function Map({location}) {
    mapboxgl.accessToken = accessToken;
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    const [globalTimeout, setGlobalTimeout] = useState(null)

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


    return (
        <div>
            <div ref={mapContainer} className="map-container" style={{height: 400}}/>
        </div>
    );
}

export default Map;