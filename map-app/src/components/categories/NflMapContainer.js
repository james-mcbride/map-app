import React, {useState, useEffect} from 'react'
import axios from 'axios'
import NflMap from "./NflMap";
import nflTeams from "./../utils/nflTeams";
import nflLogo from "./../images/nfl-1-logo-svg-vector.svg"
import afcLogo from "./../images/afc-02-logo-svg-vector.svg"
import nfcLogo from "./../images/nfc-logo-svg-vector.svg"
import TeamModal from "../TeamModal";

function NflMapContainer() {
    const [trips, setTrips] = useState([])
    const [teamModalOpen, setTeamModalOpen] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState(null)
    useEffect(() => {
        axios.get('http://192.168.86.169:8090/category/NFL')
            .then(response => {
                setTrips(response.data)
            })
    }, [])

    const getConferenceTeams = (conference, division) => {
        return Object.values(nflTeams).filter(team => team.Conference === conference && team.division === division).sort((a, b) => {
            if (a.division < b.division) {
                return -1
            }
            if (b.division < a.division) {
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
        return `${dateArray[1]}/${dateArray[2].slice(0, 2)}/${dateArray[0].slice(2,)}`
    }


    const conferenceTeamsDivs = teams => teams.map(team => {
        const visitedTeamTrips = trips?.filter(trip => {
            return team.Team.toLowerCase().includes(trip.categoryItem.toLowerCase())
        }).sort((a, b) => {
            if (a.startDate < b.startDate) {
                return -1
            }
            if (b.startDate < a.startDate) {
                return 1
            }
            return 0
        })
        let awayTeamLogo
        let score
        if (visitedTeamTrips?.length > 0) {
            let awayTeam = Object.values(nflTeams).find(nflTeam => nflTeam.Team.toLowerCase().includes(visitedTeamTrips[0].categoryItemDetail1?.toLowerCase()))
            awayTeamLogo = awayTeam?.logo
        }
        return (
            <div className={`nflTeam ${visitedTeamTrips?.length > 0 ? "visited" : ""}`}>
                <img src={team.logo}/>
                {visitedTeamTrips?.length > 0 ? <div className="game-info">
                    <div className="game-date">{gameDate(visitedTeamTrips[0].endDate)}</div>
                    <div className="game-score">
                        <div className="team-score">
                            <img className="score-logo" src={team.logo}/>
                            <div
                                className={teamWon(visitedTeamTrips[0].categoryItemDetail2, visitedTeamTrips[0].categoryItemDetail3) ? 'winner' : 'loser'}>
                                {visitedTeamTrips[0].categoryItemDetail2}
                            </div>
                        </div>
                        <div>
                            <img className="score-logo" src={awayTeamLogo}/>
                            <div
                                className={teamWon(visitedTeamTrips[0].categoryItemDetail3, visitedTeamTrips[0].categoryItemDetail2) ? 'winner' : 'loser'}>
                                {visitedTeamTrips[0].categoryItemDetail3}
                            </div>
                        </div>
                    </div>
                </div> : null}
            </div>
        )
    })

    const getNumTeamsVisited = () => {
        const teamsVisited = trips.map(trip => trip.categoryItem)
        const teamVisitedMap = {}
        let count = 0
        teamsVisited.forEach(team => {
            if (!teamVisitedMap[team]) {
                teamVisitedMap[team] = team
                count++
            }
        })
        return count
    }

    return (
        <div style={{width: "100%", height: "100%", position: "relative"}}>
            <div className="nfl-logo">
                <img src={nflLogo}/>
                <div className="teams-visited-summary">
                    <div style={{color: "#013369"}}>{`${getNumTeamsVisited()} teams visited`}</div>
                    <div style={{color: "#D50A0A"}}> {`${32 - getNumTeamsVisited()} Teams Remaining`}</div>
                </div>
            </div>
            <div className="afc-logo">
                <img src={afcLogo}/>
            </div>
            <div className="nfc-logo">
                <img src={nfcLogo}/>
            </div>
            <div className="nfl-teams afc east">
                <h2 className="division afc-division">EAST</h2>
                <div className="team-divisions-div">
                    {conferenceTeamsDivs(afcEastTeams)}
                </div>
            </div>
            <div className="nfl-teams afc south">
                <h2 className="division afc-division">SOUTH</h2>
                <div className="team-divisions-div">
                    {conferenceTeamsDivs(afcSouthTeams)}
                </div>
            </div>
            <div className="nfl-teams afc west">
                <h2 className="division afc-division">WEST</h2>
                <div className="team-divisions-div">
                    {conferenceTeamsDivs(afcWestTeams)}
                </div>
            </div>
            <div className="nfl-teams afc north">
                <h2 className="division afc-division">NORTH</h2>
                <div className="team-divisions-div">
                    {conferenceTeamsDivs(afcNorthTeams)}
                </div>
            </div>
            <div className="nfl-teams nfc east">
                <h2 className="division nfc-division">EAST</h2>
                <div className="team-divisions-div">
                    {conferenceTeamsDivs(nfcEastTeams)}
                </div>
            </div>
            <div className="nfl-teams nfc south">
                <h2 className="division nfc-division">SOUTH</h2>
                <div className="team-divisions-div">
                    {conferenceTeamsDivs(nfcSouthTeams)}
                </div>
            </div>
            <div className="nfl-teams nfc west">
                <h2 className="division nfc-division">WEST</h2>
                <div className="team-divisions-div">
                    {conferenceTeamsDivs(nfcWestTeams)}
                </div>
            </div>
            <div className="nfl-teams nfc north">
                <h2 className="division nfc-division">NORTH</h2>
                <div className="team-divisions-div">
                    {conferenceTeamsDivs(nfcNorthTeams)}
                </div>
            </div>
            <NflMap locations={trips} setOpenTeamModal={team => {
                setSelectedTeam(team)
                setTeamModalOpen(true)
            }}/>
            <TeamModal closeModal={() => setTeamModalOpen(false)} trips={trips.filter(trip => selectedTeam?.toLowerCase()?.includes(trip.categoryItem.toLowerCase()))} isOpen={teamModalOpen}/>
        </div>
    )
}

export default NflMapContainer;

