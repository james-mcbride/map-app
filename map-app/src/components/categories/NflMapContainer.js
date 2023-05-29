import React, {useState, useEffect} from 'react'
import axios from 'axios'
import NflMap from "./NflMap";
import nflTeams from "./../utils/nflTeams";
import nflLogo from "./../images/nfl-1-logo-svg-vector.svg"
import afcLogo from "./../images/afc-02-logo-svg-vector.svg"
import nfcLogo from "./../images/nfc-logo-svg-vector.svg"

function NflMapContainer() {
    const [trips, setTrips] = useState([])
    useEffect(() => {
        axios.get('http://192.168.86.169:8090/category/NFL')
            .then(response => {
                setTrips(response.data)
            })
    }, [])

    const getConferenceTeams = (conference, division) => {
        return Object.values(nflTeams).filter(team => team.Conference === conference && team.division === division).sort((a,b) => {
            if (a.division < b.division){
                return -1
            }
            if (b.division < a.division){
                return 1
            }
            return 0
        })
    }

    const afcEastTeams = getConferenceTeams("AFC", "east")
    const afcSouthTeams = getConferenceTeams("AFC", "south")
    const afcWestTeams = getConferenceTeams("AFC", "west")
    const afcNorthTeams = getConferenceTeams("AFC", "north")


    const nfcEastTeams = getConferenceTeams("NFC", "east")
    const nfcSouthTeams = getConferenceTeams("NFC", "south")
    const nfcWestTeams = getConferenceTeams("NFC", "west")
    const nfcNorthTeams = getConferenceTeams("NFC", "north")

    const teamWon = (team, opponent) => {
        return Number(team) > Number(opponent)
    }

    const gameDate = date => {
        const dateArray = date.split("-")
        return `${dateArray[1]}/${dateArray[2].slice(0,2)}/${dateArray[0].slice(2,)}`
    }



    const conferenceTeamsDivs = teams => teams.map(team => {
        const visitedTeamTrips = trips?.filter(trip => {
            return team.Team.toLowerCase().includes(trip.categoryItem.toLowerCase())
        }).sort((a,b) => {
            if (a.startDate < b.startDate){
                return -1
            }
            if (b.startDate < a.startDate){
                return 1
            }
            return 0
        })
        let awayTeamLogo
        let score
        if (visitedTeamTrips?.length > 0){
            let awayTeam = Object.values(nflTeams).find(nflTeam => nflTeam.Team.toLowerCase().includes(visitedTeamTrips[0].categoryItemDetail1?.toLowerCase()))
            awayTeamLogo = awayTeam?.logo
        }
        return (
            <div className={`nflTeam ${visitedTeamTrips?.length > 0 ? "visited" : ""}`}>
                <img src={team.logo} />
                {visitedTeamTrips?.length > 0 ? <div className="game-info">
                    <div className="game-date">{gameDate(visitedTeamTrips[0].endDate)}</div>
                    <div className="game-score">
                    <div className="team-score">
                        <img className="score-logo" src={team.logo} />
                        <div className={teamWon(visitedTeamTrips[0].categoryItemDetail2, visitedTeamTrips[0].categoryItemDetail3) ? 'winner': 'loser'}>
                            {visitedTeamTrips[0].categoryItemDetail2}
                        </div>
                    </div>
                    <div>
                        <img className="score-logo" src={awayTeamLogo} />
                        <div className={teamWon(visitedTeamTrips[0].categoryItemDetail3, visitedTeamTrips[0].categoryItemDetail2) ? 'winner': 'loser'}>
                            {visitedTeamTrips[0].categoryItemDetail3}
                        </div>
                    </div>
                </div>
                </div> : null}
            </div>
        )
    })


    return (
        <div style={{width: "100%", height: "100%", position: "relative"}}>
            <div className="afc-logo">
                <img src={afcLogo} />
            </div>
            <div className="nfc-logo">
                <img src={nfcLogo} />
            </div>
            <div className="nfl-teams afc east">
                <h2 className="division afc-division">EAST</h2>

                {conferenceTeamsDivs(afcEastTeams)}
            </div>
            <div className="nfl-teams afc south">
                <h2 className="division afc-division">SOUTH</h2>
                {conferenceTeamsDivs(afcSouthTeams)}
            </div>
            <div className="nfl-teams afc west">
                <h2 className="division afc-division">WEST</h2>
                {conferenceTeamsDivs(afcWestTeams)}
            </div>
            <div className="nfl-teams afc north">
                <h2 className="division afc-division">NORTH</h2>
                {conferenceTeamsDivs(afcNorthTeams)}
            </div>
            <div className="nfl-teams nfc east">
                <h2 className="division nfc-division">EAST</h2>
                {conferenceTeamsDivs(nfcEastTeams)}
            </div>
            <div className="nfl-teams nfc south">
                <h2 className="division nfc-division">SOUTH</h2>
                {conferenceTeamsDivs(nfcSouthTeams)}
            </div>
            <div className="nfl-teams nfc west">
                <h2 className="division nfc-division">WEST</h2>
                {conferenceTeamsDivs(nfcWestTeams)}
            </div>
            <div className="nfl-teams nfc north">
                <h2 className="division nfc-division">NORTH</h2>
                {conferenceTeamsDivs(nfcNorthTeams)}
            </div>
            <NflMap locations={trips}/>
        </div>
    )
}

export default NflMapContainer;

