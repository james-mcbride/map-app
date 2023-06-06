import React from 'react';
import ReactModal from 'react-modal';
import defaultImage from "./images/airplane.png";
import nflTeams from "./utils/nflTeams";

function TeamModal({team, trips, isOpen, closeModal}) {
    const teamTrips = trips ? trips : []

    const gameDate = date => {
        const dateArray = date.split("-")
        return `${dateArray[1]}/${dateArray[2].slice(0, 2)}/${dateArray[0].slice(2,)}`
    }

    const teamWon = (team, opponent) => {
        return Number(team) > Number(opponent)
    }

    const getTeamInfo = selectedTeam => {
        if (selectedTeam) {
            return Object.values(nflTeams).find(team => team.Team.toLowerCase().includes(selectedTeam.toLowerCase()))
        }
    }

    const tripList = teamTrips.map(trip => (
        <div className="trip-game-info-container" style={{background: getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.secondaryColor}}>
        <div className="trip-game-info">
            <div className="trip-profile-image-modal">
                <img src={trip?.trip_profile_image ? `data:image/jpeg;base64,${trip?.trip_profile_image}` : defaultImage}/>
            </div>
            <div className="game-score-modal">
                <div className="team-score-modal">
                    <div className="individual-score-logo" style={{background: getTeamInfo(trip.categoryItem).primaryColor}}>
                        <img className="score-logo-modal" src={getTeamInfo(trip.categoryItem).logo}/>
                        {getTeamInfo(trip.categoryItem).acronym}
                    </div>
                    <div className="individual-score">
                        {trip.categoryItemDetail2}
                    </div>
                </div>
                <div className="team-score-modal">
                    <div className="individual-score-logo" style={{background: getTeamInfo(trip.categoryItemDetail1).primaryColor}}>
                        <img className="score-logo-modal" src={getTeamInfo(trip.categoryItemDetail1).logo}/>
                        {getTeamInfo(trip.categoryItemDetail1).acronym}
                    </div>
                    <div className="individual-score">
                        {trip.categoryItemDetail3}
                    </div>
                </div>
                <div className="game-date-modal">{gameDate(trip.startDate)}</div>
            </div>
        </div>
        </div>
    ))
    return (
        <ReactModal isOpen={isOpen} className="view-team-modal" style={{background: `7F${getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.primaryColor}`, border: `1px solid ${trips?.length > 0 ? getTeamInfo(trips[0].categoryItem)?.secondaryColor : null}`}}>
            <div className="view-team-modal-div" style={{background: getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.primaryColor, border: `5px solid ${trips?.length > 0 ? getTeamInfo(trips[0].categoryItem)?.secondaryColor : null}`, color: getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.secondaryColor}}>
                <button
                    className="team-modal-button"
                    onClick={() => closeModal()}
                    style={{background: getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.secondaryColor, color: getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.primaryColor}}
                >close</button>
                <h1 className="team-modal-header">{getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.Team}</h1>
                {tripList}
            </div>
        </ReactModal>
    )
}

export default TeamModal;