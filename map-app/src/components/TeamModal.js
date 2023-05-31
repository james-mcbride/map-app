import React from 'react';
import ReactModal from 'react-modal';
import defaultImage from "./images/airplane.png";


function TeamModal({team, trips, isOpen}) {
    const teamTrips = trips ? trips : []
    const tripList = teamTrips.map(trip => (
        <div>
            {trip.name}
            <div className="trip-profile-image"><img src={trip?.trip_profile_image ? `data:image/jpeg;base64,${trip?.trip_profile_image}` : defaultImage}/></div>
        </div>
    ))
    return (
        <ReactModal isOpen={isOpen} className="view-team-modal">
            {tripList}
        </ReactModal>
    )
}

export default TeamModal;