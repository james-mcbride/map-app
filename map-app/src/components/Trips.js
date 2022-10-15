import React, {useEffect, useState} from 'react'
import axios from "axios";
import AllTripsMap from "./AllTripsMap";

function Trips(){
    const [trips, setTrips] = useState([])
    const [locations, setLocations] = useState([])
    const [numTrips, setNumTrips] = useState(0)
    useEffect(() => {
        retrieveTrips(0)
    }, []);

    function retrieveTrips(index) {
        if (!numTrips || index * 10 < numTrips) {
            axios.get(`http://192.168.86.57:8090/trip/page/${index}`)
                .then(response => {
                    if (index === 0) {
                        setNumTrips(num => num + response.data.numTrips)
                    }
                    // console.log(trips);
                    // console.log(response.data.trips);
                    // const updatedTrips = trips.concat(response.data.trips)
                    // console.log(updatedTrips)
                    setTrips(trips => trips.concat(response.data.trips));
                    setLocations(locations => locations.concat(response.data.locations));
                    const numberOfTrips = numTrips ? numTrips : response.data.numTrips
                    console.log(index, numberOfTrips)
                    if ((10 + index * 10) < numberOfTrips) {
                        retrieveTrips(index+=1)
                    }
                })
        }
    }

    const filterTripsForMarkerEvent = tripLocation => {

    }

    const showTrips = () => {
        return trips.map(trip => {
         return (
             <div className="trip-tile">
                 <div className="trip-tile-main">
                 <div className="trip-profile-image"><img src={`data:image/jpeg;base64,${trip?.trip_profile_image}`}/></div>
                 <div>
                     <h2>{trip.name}</h2>
                     <h4>{trip.location}</h4>
                     <h5>{`${trip.startDate.split(" ")[0]} - ${trip.endDate.split(" ")[0]}`}</h5>
                     <a href={`/trip/${trip.id}`}><button>Edit Trip</button></a>
                 </div>
                 </div>
             </div>
         )
        })
    }

    return (
        <div style={{position: "relative"}}>
            <a href="/create"><button className="ui button" type="button" style={{position: "absolute",right: 10, top: 10, background: "gold", zIndex: 5}}>Create Trip</button></a>
            <AllTripsMap locations={locations ? locations : []} onMarkerEvent={filterTripsForMarkerEvent}/>
            <div id="trip-list">
                {showTrips()}
            </div>
        </div>
    )
}

export default Trips;