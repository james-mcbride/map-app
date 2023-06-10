import React, {useEffect, useState} from 'react';
import ReactModal from 'react-modal';
import defaultImage from "./images/airplane.png";
import nflTeams from "./utils/nflTeams";
import axios from "axios";
import Image from "./Image";

function TeamModal({trips, isOpen, closeModal}) {

    const [selectedTripId, setSelectedTripId] = useState(null)
    const [images, setImages] = useState([])

    useEffect(() => {
        if (selectedTripId && isOpen) {
            axios.get(`http://192.168.86.169:8090/trip/${selectedTripId}/images`)
                .then(response => {
                    if (response.data.length <= 5) {
                        setImages(response.data);
                    } else {
                        retrieveImage(response.data, 0)
                    }
                })
        }
    }, [selectedTripId, isOpen])

    function retrieveImage(imageList, index) {
        if (index < imageList.length) {
            axios.get(`http://192.168.86.169:8090/image/${imageList[index].id}`)
                .then(response => {
                    imageList[index].image_location = response.data.image_location
                    setImages([...imageList])
                    retrieveImage(imageList, index + 1)
                })
        }
    }

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
        <div
            className="trip-game-info-container"
            style={{background: getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.secondaryColor}}
            onClick={() => setSelectedTripId(trip.id)}
        >
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

    const imageList = images.filter(image => {
        return image.image_location
    }).map(image => {
        return <Image imageFile={image} editImage={false} imageIdsForNewActivity={[]}
                      key={image.id}/>
    })

    return (
        <ReactModal isOpen={isOpen} className="view-team-modal" style={{background: `7F${getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.primaryColor}`, border: `1px solid ${trips?.length > 0 ? getTeamInfo(trips[0].categoryItem)?.secondaryColor : null}`}}>
            <div className="view-team-modal-div" style={{background: getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.primaryColor, border: `5px solid ${trips?.length > 0 ? getTeamInfo(trips[0].categoryItem)?.secondaryColor : null}`, color: getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.secondaryColor}}>
                <button
                    className="team-modal-button"
                    onClick={() => {
                        setImages([])
                        setSelectedTripId(null)
                        closeModal()
                    }}
                    style={{background: getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.secondaryColor, color: getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.primaryColor}}
                >close</button>
                <h1 className="team-modal-header">{getTeamInfo(trips?.length > 0 ? trips[0].categoryItem : null)?.Team}</h1>
                {tripList}
            </div>
            <div className="team-images-div">
                {imageList}
            </div>
        </ReactModal>
    )
}

export default TeamModal;