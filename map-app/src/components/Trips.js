import React, {useEffect, useState} from 'react'
import axios from "axios";
import AllTripsMap from "./AllTripsMap";
import ViewTrip from "./ViewTrip";
import CreateTrip from "./CreateTrip";

function Trips(){
    const [trips, setTrips] = useState([])
    const [locations, setLocations] = useState([])
    const [numTrips, setNumTrips] = useState(0)
    const [locationsClickedStatus, setLocationsClickedStatus] = useState({})
    const [openViewTripModal, setOpenViewTripModal] = useState(false)
    const [viewTripId, setViewTripId] = useState(null)
    const [filterTrips, setFilterTrips] = useState(false)
    const [openCreateTripModal, setOpenCreateTripModal] = useState(false)

    useEffect(() => {
        retrieveTrips(0)
    }, []);

    function retrieveTrips(index) {
        if (!numTrips || index * 10 < numTrips) {
            axios.get(`http://localhost:8090/trip/page/${index}`)
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
                    setLocationsClickedStatus(obj => {
                        const updatedObj = {...obj}
                        response.data.locations.forEach(location => {
                            updatedObj[location] = false
                        })
                        return updatedObj
                    })
                    const numberOfTrips = numTrips ? numTrips : response.data.numTrips
                    console.log(index, numberOfTrips)
                    if ((10 + index * 10) < numberOfTrips) {
                        retrieveTrips(index+=1)
                    }
                })
        }
    }

    const filterTripsForMarkerEvent = (tripLocation) => {
        setLocationsClickedStatus(obj => {
            const updatedTripLocationsObj = { ...obj }
            Object.keys(updatedTripLocationsObj).forEach(location => {
                if (tripLocation !== location)
                    updatedTripLocationsObj[location] = false
            })
            updatedTripLocationsObj[tripLocation] = !updatedTripLocationsObj[tripLocation]
            return updatedTripLocationsObj
        })
    }

    const markerSelected = () => {
        let numSelected = 0;
        Object.keys(locationsClickedStatus).forEach(location=> {
            if (locationsClickedStatus[location]) {
                numSelected++
            }
        })
        return numSelected > 0
    }

    const showFilteredTrips = () => {
        const markerCurrentlySelected = markerSelected();
        return trips.filter(trip => !markerCurrentlySelected || (locationsClickedStatus[trip.location]  && markerCurrentlySelected)).sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            console.log(b.startDate)
            return new Date(b.startDate) - new Date(a.startDate);
        }).map(trip => {
         return (
             <div className="trip-tile">
                 <div className="trip-tile-main">
                 <div className="trip-profile-image"><img src={`data:image/jpeg;base64,${trip?.trip_profile_image}`}/></div>
                 <div>
                     <h2>{trip.name}</h2>
                     <h4>{trip.location}</h4>
                     <h5>{`${trip.startDate.split(" ")[0]} - ${trip.endDate.split(" ")[0]}`}</h5>
                     <button onClick={() => {
                         setViewTripId(trip.id)
                         setOpenViewTripModal(true)
                     }}>Edit Trip</button>
                 </div>
                 </div>
             </div>
         )
        })
    }

    const showTrips = () => {
        const markerCurrentlySelected = markerSelected();
        return trips.filter(trip => !markerCurrentlySelected || (locationsClickedStatus[trip.location]  && markerCurrentlySelected)).map(trip => {
            return (
                <div className="trip-tile">
                    <div className="trip-tile-main">
                        <div className="trip-profile-image"><img src={`data:image/jpeg;base64,${trip?.trip_profile_image}`}/></div>
                        <div>
                            <h2>{trip.name}</h2>
                            <h4>{trip.location}</h4>
                            <h5>{`${trip.startDate.split(" ")[0]} - ${trip.endDate.split(" ")[0]}`}</h5>
                            <button onClick={() => {
                                setViewTripId(trip.id)
                                setOpenViewTripModal(true)
                            }}>Edit Trip</button>
                        </div>
                    </div>
                </div>
            )
        })
    }

    return (
        <div style={{position: "relative"}}>
            <button className="ui button" type="button" onClick={() => setOpenCreateTripModal(true)} style={{position: "absolute",right: 10, top: 10, background: "gold", zIndex: 5}}>Create Trip</button>
            <AllTripsMap initialZoomLevel={2} locations={locations ? locations : []} onMarkerEvent={filterTripsForMarkerEvent} locationsClickedStatus={locationsClickedStatus}/>
            <div id="trip-list" style={{position: "relative"}}>
                <button onClick={() => setFilterTrips(true)} id="filter-trips-button">Sort By Date</button>
                {filterTrips ? showFilteredTrips() : showTrips()}
            </div>
            <ViewTrip open={openViewTripModal} tripId={viewTripId} onClose={() => {
                setOpenViewTripModal(false)
                setViewTripId(null)
            }}/>
            <CreateTrip open={openCreateTripModal} onClose={newTrip => {
                setOpenCreateTripModal(false)
                if (newTrip) {
                    setTrips([...trips, newTrip])
                    setLocations([...locations, newTrip.location])
                    setViewTripId(newTrip.id)
                    setOpenViewTripModal(true)
                }
            }}/>
        </div>
    )
}

export default Trips;