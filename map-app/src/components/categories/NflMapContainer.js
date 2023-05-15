import React, {useState, useEffect} from 'react'
import axios from 'axios'
import NflMap from "./NflMap";
import nflTeams from "./../utils/nflTeams";

function NflMapContainer() {
    const [trips, setTrips] = useState([])
    useEffect(() => {
        axios.get('http://192.168.86.169:8090/category/NFL')
            .then(response => {
                setTrips(response.data)
            })
    }, [])

    const getConferenceTeams = conference => {
        return Object.values(nflTeams).filter(team => team.Conference === conference).sort((a,b) => {
            if (a.division < b.division){
                return -1
            }
            if (b.division < a.division){
                return 1
            }
            return 0
        })
    }

    const afcTeams = getConferenceTeams("AFC")

    const nfcTeams = getConferenceTeams("NFC")

    const conferenceTeamsDivs = teams => teams.map(team => {
        return (
            <div className={`nflTeam ${trips.filter(trip => {
                return team.Team.toLowerCase().includes(trip.categoryItem.toLowerCase())
            })?.length > 0 ? "visited" : ""}`}>
                <img src={team.logo} />
            </div>
        )
    })


    return (
        <div style={{width: "100%", height: "100%", position: "relative"}}>
            <div className="nfl-teams afc">
                {conferenceTeamsDivs(afcTeams)}
            </div>
            <div className="nfl-teams nfc">
                {conferenceTeamsDivs(nfcTeams)}
            </div>
            <NflMap locations={trips}/>
        </div>
    )
}

export default NflMapContainer;

