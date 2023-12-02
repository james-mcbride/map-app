import React, {useEffect, useState} from 'react'
import axios from "axios";
import AllTripsMap from "./AllTripsMap";
import ViewTrip from "./ViewTrip";
import CreateTrip from "./CreateTrip";
import defaultImage from './images/airplane.png'
import RingLoader from "react-spinners/RingLoader";


function Trips() {
    const [trips, setTrips] = useState([])
    const [locations, setLocations] = useState([])
    const [numTrips, setNumTrips] = useState(0)
    const [locationsClickedStatus, setLocationsClickedStatus] = useState({})
    const [openViewTripModal, setOpenViewTripModal] = useState(false)
    const [viewTripId, setViewTripId] = useState(null)
    const [filterTrips, setFilterTrips] = useState(false)
    const [openCreateTripModal, setOpenCreateTripModal] = useState(false)
    const [retrievingTrips, setRetrievingTrips] = useState(false)
    const [selectedPage, setSelectedPage] = useState(0)

    useEffect(() => {
        retrieveTrips(0)
        setRetrievingTrips(true)
    }, []);

    function retrieveTrips(index) {
        if (!numTrips || index * 12 < numTrips) {
            axios.get(`http://192.168.1.69:8090/trip/page/${index}`)
                .then(response => {
                    if (index === 0) {
                        setNumTrips(response.data.numTrips)
                        setLocations(locations => {
                            if (!locations) {
                                return locations
                            }
                            return response.data.locations
                        });
                    }
                    setTrips(response.data.trips);
                    setLocationsClickedStatus(obj => {
                        const updatedObj = {...obj}
                        response.data.locations.forEach(location => {
                            updatedObj[location] = false
                        })
                        return updatedObj
                    })
                    setRetrievingTrips(false)
                })
        }
    }

    function retrieveTripsByLocation(location) {
        const cityName = location.split(",")[0].toLowerCase();
        axios.get(`http://192.168.1.69:8090/trip/location/${cityName}`)
            .then(response => {
                setNumTrips(response.data.numTrips)
                setTrips(response.data.trips);
            })
    }

    const filterTripsForMarkerEvent = (tripLocation) => {
        setLocationsClickedStatus(obj => {
            const updatedTripLocationsObj = {...obj}
            Object.keys(updatedTripLocationsObj).forEach(location => {
                if (tripLocation !== location)
                    updatedTripLocationsObj[location] = false
            })
            const viewingTripsForLocation = !updatedTripLocationsObj[tripLocation]
            updatedTripLocationsObj[tripLocation] = viewingTripsForLocation
            if (viewingTripsForLocation) {
                retrieveTripsByLocation(tripLocation)
            } else {
                retrieveTrips(0)
            }
            setTrips([])
            return updatedTripLocationsObj
        })
    }

    const markerSelected = () => {
        let numSelected = 0;
        Object.keys(locationsClickedStatus).forEach(location => {
            if (locationsClickedStatus[location]) {
                numSelected++
            }
        })
        return numSelected > 0
    }

    const showTrips = (tripsList) => {
        const markerCurrentlySelected = markerSelected();
        return tripsList.map(trip => {
            return (
                <div className="trip-tile">
                    <div className="trip-tile-main">
                        <div className="trip-profile-image"><img
                            src={trip?.trip_profile_image ? `data:image/jpeg;base64,${trip?.trip_profile_image}` : defaultImage}/>
                        </div>
                        <div>
                            <h2>{trip?.name}</h2>
                            <h4>{trip.location}</h4>
                            <h5>{`${trip.startDate.split(" ")[0]} - ${trip.endDate.split(" ")[0]}`}</h5>
                            <button onClick={() => {
                                setViewTripId(trip.id)
                                setOpenViewTripModal(true)
                            }}>Edit Trip
                            </button>
                        </div>
                    </div>
                </div>
            )
        })
    }

    const showPaginationButtons = () => {

        if (numTrips > 0) {
            const numPages = Math.ceil(numTrips / 12)
            let buttons = []
            buttons.push(
                <button
                    style={selectedPage === 0 ? {display: "none"} : {}}
                    onClick={() => {
                        setTrips([])
                        setSelectedPage(selectedPage - 1)
                        retrieveTrips(selectedPage - 1)
                    }}
                >{"<"}</button>
            )
            for (let i = 0; i < numPages; i++) {
                buttons.push(
                    <button disabled={selectedPage === i} onClick={() => {
                        setTrips([])
                        setSelectedPage(i)
                        retrieveTrips(i)
                    }}
                    >{i + 1}</button>
                )
            }
            buttons.push(
                <button
                    style={selectedPage === numPages - 1 ? {display: "none"} : {}}
                    onClick={() => {
                        setTrips([])
                        setSelectedPage(selectedPage + 1)
                        retrieveTrips(selectedPage + 1)
                    }}
                >{">"}</button>
            )
            return buttons
        }
        return null
    }

    return (
        <div style={openViewTripModal ? {position: "fixed"} : {position: "relative"}}>
            <button className="ui button" id="create-trip-button" type="button"
                    onClick={() => setOpenCreateTripModal(true)}>Create Trip
            </button>
            <AllTripsMap
                initialZoomLevel={2}
                locations={locations ? locations : []}
                onMarkerEvent={filterTripsForMarkerEvent}
                locationsClickedStatus={locationsClickedStatus}
                location="Memphis, TN"
                includeZoom={true}
                onTripsPage={true}
                retrievingLocations={retrievingTrips}
                viewingMultipleTrips={true}
            />
            {!trips?.length && (
                <div className="spinner-container">
                    <RingLoader
                        color={"red"}
                        loading={true}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            )}
            <div id="trip-list" style={{position: "relative"}}>
                {showTrips(trips)}
            </div>
            <div className="trips-pagination-buttons">
                {trips?.length > 0 && showPaginationButtons()}
            </div>
            <ViewTrip
                open={openViewTripModal}
                tripId={viewTripId}
                onClose={(updatedTrip, deleteTripBoolean) => {
                    setOpenViewTripModal(false)
                    setViewTripId(null)
                    if (updatedTrip && deleteTripBoolean) {
                        let numDeletedTripLocation = 0
                        trips.forEach(trip => {
                            if (updatedTrip.location === trip.location) {
                                numDeletedTripLocation++
                            }
                        })
                        if (numDeletedTripLocation === 1) {
                            setLocations(locations.filter(location => location !== updatedTrip.location))
                        }
                        setTrips(trips.filter(trip => trip.id !== updatedTrip.id))
                    } else if (updatedTrip && !deleteTripBoolean) {
                        const updatedTrips = trips.map(trip => {
                            const tripCopy = {...trip}
                            if (trip.id === updatedTrip.id) {
                                tripCopy.trip_profile_image = updatedTrip.profilePicture
                                tripCopy.profileImageId = updatedTrip.profilePictureId
                            }
                            return tripCopy
                        })
                        setTrips(updatedTrips)
                    }
                }}
                onTripUpdate={updatedTrip => {
                    setOpenViewTripModal(false)
                    setViewTripId(null)
                    setTrips(trips.map(trip => {
                        if (trip.id === updatedTrip.id) {
                            return updatedTrip
                        }
                        return trip
                    }))
                }}
            />
            <CreateTrip open={openCreateTripModal} locations={locations ? locations : []} onClose={newTrip => {
                setOpenCreateTripModal(false)
                if (newTrip) {
                    setTrips([newTrip, ...trips])
                    setLocations([...locations, newTrip.location])
                    setViewTripId(newTrip.id)
                    setOpenViewTripModal(true)
                }
            }}/>
        </div>
    )
}

export default Trips;