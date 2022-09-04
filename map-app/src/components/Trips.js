import React, {useEffect, useState} from 'react'
import axios from "axios";
import AllTripsMap from "./AllTripsMap";

function Trips(){
    const [trips, setTrips] = useState([])
    const [locations, setLocations] = useState([])
    const [retrievedTrips, setRetrievedTrips] = useState(false)
    useEffect(() => {
        setRetrievedTrips(true);
        if (!retrievedTrips) {
            axios.get('http://192.168.86.46:8090/trip/page/0')
                .then(response => {
                    console.log(response.data)
                    setTrips(response.data.trips)
                    setLocations(response.data.locations)
                })
        }
    }, []);

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
            <AllTripsMap locations={locations ? locations : []}/>
            <div id="trip-list">
                {showTrips()}
            </div>
        </div>
    )
}

export default Trips;