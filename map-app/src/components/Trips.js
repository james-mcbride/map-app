import React, {useEffect, useState} from 'react'
import axios from "axios";

function Trips(){
    const [trips, setTrips] = useState([])
    useEffect(() => {
        axios.get('http://192.168.86.46:8090/trip')
            .then(response => setTrips(response.data))
    }, [])
    const showTrips = () => {
        return trips.map(trip => {
         return (
             <div className="trip-tile">
                 <h3>{trip.name}</h3>
                 <h4>{trip.location}</h4>
                 <h5>{`${trip.startDate.split(" ")[0]} - ${trip.endDate.split(" ")[0]}`}</h5>
                 <a href={`/trip/${trip.id}`}><button>Edit Trip</button></a>
             </div>
         )
        })
    }
    return (
        <div>
            <a href="/create"><button className="ui button" type="button" style={{float: "Right", background: "gold"}}>Create Trip</button></a>
            <div id="trip-list">
                {showTrips()}
            </div>
        </div>
    )
}

export default Trips;