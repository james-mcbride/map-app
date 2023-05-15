import React, {useEffect, useRef, useState} from 'react'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import {accessToken} from "./../tokens";
import nflTeams from "./../utils/nflTeams";
import stateBoundaries from "../utils/us-state-boundaries";

const kansas = {
    "type": "FeatureCollection", "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[-102.0517, 40.0031], [-100.4956, 40.0017], [-99.3098, 40.0018], [-98.5003, 40.0022], [-97.4634, 40.002], [-96.6204, 40.001], [-95.3083, 40], [-95.0902, 39.8631], [-94.9533, 39.901], [-94.8837, 39.8317], [-95.1081, 39.5399], [-94.9902, 39.4462], [-94.8317, 39.2159], [-94.6073, 39.1134], [-94.6134, 38.458], [-94.6176, 37.7807], [-94.618, 36.9989], [-95.381, 36.9993], [-96.5001, 36.9986], [-97.4899, 36.9986], [-98.31, 36.9977], [-99.6477, 37], [-101.1254, 36.9975], [-102.0421, 36.993], [-102.0416, 37.6967], [-102.0453, 38.8569], [-102.0517, 40.0031]]]
            },
            "properties": {"STATE_ID": "20", "STATE_NAME": "Kansas"},
            "id": 20
        }
    ]
}

function NflMap({locations}) {
    mapboxgl.accessToken = accessToken;
    const mapContainer = useRef(null);
    const map = useRef(null);


    useEffect(() => {
        if (locations && locations.length) {
            locations.forEach(location => {
                const teamInfo = nflTeams[location.categoryItem]
                // const teamMarker = <div>
                //     <img src={chiefsLogo} />
                // </div>
                const teamMarker = document.createElement('div')
                teamMarker.setAttribute("class", "teamLogoMarker")
                const image = document.createElement('img')
                image.setAttribute('src', teamInfo.logo)
                teamMarker.appendChild(image)
                const marker = new mapboxgl.Marker(teamMarker)
                    .setLngLat({
                        lng: teamInfo.Long,
                        lat: teamInfo.Lat
                    })
                    .addTo(map.current);
            })
            // **** this code below adds all team logos, but blacks out those you haven't been to yet
            // Object.values(nflTeams).forEach(team => {
            //         const teamMarker = document.createElement('div')
            //         const image = document.createElement('img')
            //         image.setAttribute('src', team.logo)
            //         let teamMarkerClass = "teamLogoMarker"
            //         if (locations.filter(location => team.Team.toLowerCase().includes(location.categoryItem.toLowerCase())).length === 0){
            //             teamMarkerClass += " hidden"
            //         }
            //     teamMarker.setAttribute("class", teamMarkerClass)
            //     teamMarker.appendChild(image)
            //         const marker = new mapboxgl.Marker(teamMarker)
            //             .setLngLat({
            //                 lng: team.Long,
            //                 lat: team.Lat
            //             })
            //             .addTo(map.current);
            // })
            map.current.on('load', () => {
                // map.current.addSource('states', {
                //     'type': 'geojson',
                //     'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
                // });
                stateBoundaries.features.forEach(stateInfo => {
                    const stateTeam = Object.values(nflTeams).find(team => team?.territory?.includes(stateInfo.properties.STATE_NAME))
                    console.log(stateTeam)
                    let addTeamColorsToState = false
                    if (stateTeam){
                        console.log("logging locations")
                        console.log(locations)
                        locations.forEach(location => {
                            if(stateTeam.Team.toLowerCase().includes(location.categoryItem.toLowerCase())){
                                console.log("adding team colors to state for: " + stateTeam.Team)
                                addTeamColorsToState = true
                            }
                        })
                    }
                    // team.Team.toLowerCase().includes(trip.categoryItem.toLowerCase()
                    map.current.addSource(stateInfo.properties.STATE_NAME, {
                        'type': 'geojson',
                        'data': {
                            "type": "FeatureCollection",
                            "features": [
                                stateInfo
                            ]
                        }
                    });


                    map.current.addLayer({
                        'id': `${stateInfo.properties.STATE_NAME}state-fills`,
                        'type': 'fill',
                        'source': stateInfo.properties.STATE_NAME,
                        'layout': {},
                        'paint': {
                            'fill-color': addTeamColorsToState ? stateTeam.primaryColor : '#565656',
                            'fill-opacity': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], false],
                                1,
                                0.95
                            ]
                        }
                    });

                    map.current.addLayer({
                        'id': `${stateInfo.properties.STATE_NAME}state-borders`,
                        'type': 'line',
                        'source': stateInfo.properties.STATE_NAME,
                        'layout': {},
                        'paint': {
                            'line-color': addTeamColorsToState ? stateTeam.secondaryColor : '#565656',
                            'line-width': 1
                        }
                    });
                })




            });
        }
    }, [locations, map.current])


    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-99.1, 37.8],
            zoom: 4.3,
        });
        // Data: UN Human Development Index 2017 Europe extract
// Source: https://ourworldindata.org/human-development-index
        const data = [
            {"code": "CUB"},
            {'code': "BHS"},
            {'code': 'MEX', 'hdi': 0},
            {'code': 'CAN', 'hdi': 0}
        ];

        map.current.on('load', () => {
// Add source for country polygons using the Mapbox Countries tileset
// The polygons contain an ISO 3166 alpha-3 code which can be used to for joining the data
// https://docs.mapbox.com/vector-tiles/reference/mapbox-countries-v1
            map.current.addSource('countries', {
                type: 'vector',
                url: 'mapbox://mapbox.country-boundaries-v1'
            });

// Build a GL match expression that defines the color for every vector tile feature
// Use the ISO 3166-1 alpha 3 code as the lookup key for the country shape
            const matchExpression = ['match', ['get', 'iso_3166_1_alpha_3']];

// Calculate color values for each country based on 'hdi' value
            for (const row of data) {
// Convert the range of data values to a suitable color
                const green = row['hdi'] * 255;
                const color = `rgb(255, 255, 255)`;

                matchExpression.push(row['code'], color);
            }

// Last value is the default, used where there is no data
            matchExpression.push('rgba(0, 0, 0, 0)');


// The mapbox.country-boundaries-v1 tileset includes multiple polygons for some
// countries with disputed borders.  The following expression filters the
// map view to show the "US" perspective of borders for disputed countries.
// Other world views are available, for more details, see the documentation
// on the "worldview" feature property at
// https://docs.mapbox.com/data/tilesets/reference/mapbox-countries-v1/#--polygon---worldview-text
            const WORLDVIEW = "US";
            const worldview_filter = ["all", ["==", ["get", "disputed"], "false"], ["any", ["==", "all", ["get", "worldview"]], ["in", WORLDVIEW, ["get", "worldview"]]]];

// Add layer from the vector tile source to create the choropleth
// Insert it below the 'admin-1-boundary-bg' layer in the style
            map.current.addLayer(
                {
                    'id': 'countries-join',
                    'type': 'fill',
                    'source': 'countries',
                    'source-layer': 'country_boundaries',
                    'paint': {
                        'fill-color': matchExpression
                    },
                    'filter': worldview_filter
                },
                'admin-1-boundary-bg'
            );
        });

    });

    return (
        <div id='fullScreenMap'>
            <div ref={mapContainer} className="map-container-fullscreen"/>
        </div>
    );
}

export default NflMap;