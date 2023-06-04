import chiefsLogo from '../images/kansas-city-chiefs-logo.svg'
import raidersLogo from '../images/oakland-raiders-logo.svg'
import broncosLogo from '../images/denver-broncos-logo.svg'
import chargersLogo from '../images/los-angeles-chargers-logo.svg'
import steelersLogo from '../images/pittsburgh-steelers-logo.svg'
import ravensLogo from '../images/baltimore-ravens-logo.svg'
import bengalsLogo from '../images/cincinnati-bengals-logo.svg'
import brownsLogo from '../images/cleveland-browns-logo.svg'
import patriotsLogo from '../images/new-england-patriots-logo.svg'
import billsLogo from '../images/buffalo-bills-logo.svg'
import jetsLogo from '../images/new-york-jets-logo.svg'
import dolphinsLogo from '../images/miami-dolphins-logo.svg'
import texansLogo from '../images/houston-texans-logo.svg'
import coltsLogo from '../images/indianapolis-colts-logo.svg'
import titansLogo from '../images/tennessee-titans-logo.svg'
import jaguarsLogo from '../images/jacksonville-jaguars-logo.svg'
import panthersLogo from '../images/carolina-panthers-logo.svg'
import saintsLogo from '../images/new-orleans-saints-logo.svg'
import buccaneersLogo from '../images/tampa-bay-buccaneers-logo.svg'
import falconsLogo from '../images/atlanta-falcons-logo.svg'
import bearsLogo from '../images/chicago-bears-logo.svg'
import packersLogo from '../images/green-bay-packers-logo.svg'
import vikingsLogo from '../images/minnesota-vikings-logo.svg'
import lionsLogo from '../images/detroit-lions-logo.svg'
import seahawksLogo from '../images/seattle-seahawks-logo.svg'
import fortyNinersLogo from '../images/san-francisco-49ers-logo.svg'
import cardinalsLogo from '../images/arizona-cardinals-logo.svg'
import ramsLogo from '../images/los-angeles-rams-logo.svg'
import cowboysLogo from '../images/dallas-cowboys-logo.svg'
import giantsLogo from '../images/new-york-giants-logo.svg'
import redskinsLogo from '../images/washington-redskins-logo.svg'
import eaglesLogo from '../images/philadelphia-eagles-logo.svg'



const nflTeams = {
    "Giants": {
        "League": "NFL",
        "Team": "New York Giants",
        "Lat": 41.313611,
        "Long": -74.074444,
        "Stadium": "MetLife Stadium",
        "Conference": "NFC",
        logo: giantsLogo,
        division: "east",
        acronym: "NYG"
    },
    "Jets": {
        "League": "NFL",
        "Team": "New York Jets",
        "Lat": 40.313611,
        "Long": -73.274444,
        "Stadium": "MetLife Stadium",
        "Conference": "AFC",
        logo: jetsLogo,
        division: "east",
        acronym: "NYJ"
    },
    "Packers": {
        "League": "NFL",
        "Team": "Green Bay Packers",
        "Lat": 44.501389,
        "Long": -88.062222,
        "Stadium": "Lambeau Field",
        "Conference": "NFC",
        logo: packersLogo,
        division: "north",
        acronym: "GB"
    },

    "Cowboys": {
        "League": "NFL",
        "Team": "Dallas Cowboys",
        "Lat": 32.747778,
        "Long": -97.092778,
        "Stadium": "AT&T Stadium",
        "Conference": "NFC",
        logo: cowboysLogo,
        division: "east",
        territory: ["Texas", "Oklahoma"],
        primaryColor:"#869397",
        secondaryColor: "#041E42",
        acronym: "DAL"
    },
    "Commanders": {
        "League": "NFL",
        "Team": "Washington Commanders",
        "Lat": 38.907778,
        "Long": -76.864444,
        "Stadium": "FedEx Field",
        "Conference": "NFC",
        logo: redskinsLogo,
        division: "east",
        acronym: "WAS"
    },
    "Chiefs": {
        "League": "NFL",
        "Team": "Kansas City Chiefs",
        "Lat": 39.048889,
        "Long": -94.483889,
        "Stadium": "Arrowhead Stadium",
        "Conference": "AFC",
        "logo": chiefsLogo,
        division: "west",
        territory: ["Kansas", "Missouri"],
        primaryColor: "#E31837",
        secondaryColor: "#FFB81C",
        acronym: "KC"
    },
    "Broncos": {
        "League": "NFL",
        "Team": "Denver Broncos",
        "Lat": 39.743889,
        "Long": -105.02,
        "Stadium": "Sports Authority Field at Mile High",
        "Conference": "AFC",
        logo: broncosLogo,
        division: "west",
        acronym: "DEN"
    },
    "Dolphins": {
        "League": "NFL",
        "Team": "Miami Dolphins",
        "Lat": 25.958056,
        "Long": -80.238889,
        "Stadium": "Hard Rock Stadium",
        "Conference": "AFC",
        logo: dolphinsLogo,
        division: "east",
        acronym: "MIA"
    },
    "Panthers": {
        "League": "NFL",
        "Team": "Carolia Panthers",
        "Lat": 35.225833,
        "Long": -80.852778,
        "Stadium": "Bank of America Stadium",
        "Conference": "NFC",
        logo: panthersLogo,
        division: "south",
        acronym: "CAR"
    },
    "Saints": {
        "League": "NFL",
        "Team": "New Orleans Saints",
        "Lat": 29.950833,
        "Long": -90.081111,
        "Stadium": "Mercedes-Benz Superdome",
        "Conference": "NFC",
        logo: saintsLogo,
        division: "south",
        territory: ["Louisiana", "Mississippi", "Arkansas"],
        primaryColor: "#D3BC8D",
        secondaryColor: "#101820",
        acronym: "NO"
    },
    "Browns": {
        "League": "NFL",
        "Team": "Cleveland Browns",
        "Lat": 41.506111,
        "Long": -81.699444,
        "Stadium": "FirstEnergy Stadium",
        "Conference": "AFC",
        logo: brownsLogo,
        division: "north",
        territory: ["Northeast Ohio"],
        primaryColor: "#FF3C00",
        secondaryColor: "#311D00",
        acronym: "CLE"
    },
    "Bills": {
        "League": "NFL",
        "Team": "Buffalo Bills",
        "Lat": 42.773611,
        "Long": -78.786944,
        "Stadium": "Ralph Wilson Stadium",
        "Conference": "AFC",
        logo: billsLogo,
        division: "east",
        acronym: "BUF"
    },
    "Titans": {
        "League": "NFL",
        "Team": "Tennessee Titans",
        "Lat": 36.166389,
        "Long": -86.771389,
        "Stadium": "Nissan Stadium",
        "Conference": "AFC",
        logo: titansLogo,
        division: "south",
        acronym: "TEN"
    },
    "Patriots": {
        "League": "NFL",
        "Team": "New England Patriots",
        "Lat": 42.090944,
        "Long": -71.26344,
        "Stadium": "Gillette Stadium",
        "Conference": "AFC",
        logo: patriotsLogo,
        division: "east",
        acronym: "NE"
    },
    "Eagles": {
        "League": "NFL",
        "Team": "Philadelphia Eagles",
        "Lat": 39.900833,
        "Long": -75.1675,
        "Stadium": "Lincoln Financial Field",
        "Conference": "NFC",
        logo: eaglesLogo,
        division: "east",
        acronym: "PHI"
    },
    "49ers": {
        "League": "NFL",
        "Team": "San Francisco 49ers",
        "Lat": 37.403,
        "Long": 121.97,
        "Stadium": "Levis Stadium",
        "Conference": "NFC",
        logo: fortyNinersLogo,
        division: "west",
        acronym: "SF"
    },
    "Jaguars": {
        "League": "NFL",
        "Team": "Jacksonville Jaguars",
        "Lat": 30.323889,
        "Long": -81.6375,
        "Stadium": "EverBank Field",
        "Conference": "AFC",
        logo: jaguarsLogo,
        division: "south",
        acronym: "JAX",
        primaryColor: "#00677F",
        secondaryColor: "#D7A22A"
    },
    "Seahawks": {
        "League": "NFL",
        "Team": "Seattle Seahawks",
        "Lat": 47.595278,
        "Long": -122.331667,
        "Stadium": "CenturyLink Field",
        "Conference": "NFC",
        logo: seahawksLogo,
        division: "west",
        acronym: "SEA"
    },
    "Buccaneers": {
        "League": "NFL",
        "Team": "Tampa Bay Buccaneers",
        "Lat": 27.975833,
        "Long": -82.503333,
        "Stadium": "Raymond James Stadium",
        "Conference": "NFC",
        logo: buccaneersLogo,
        division: "south",
        acronym: "TB"
    },
    "Bengals": {
        "League": "NFL",
        "Team": "Cincinnati Bengals",
        "Lat": 39.095444,
        "Long": -84.516039,
        "Stadium": "Paul Brown Stadium",
        "Conference": "AFC",
        logo: bengalsLogo,
        division: "north",
        acronym: "CIN"
    },
    "Steelers": {
        "League": "NFL",
        "Team": "Pittsburgh Steelers",
        "Lat": 40.446667,
        "Long": -80.015833,
        "Stadium": "Heinz Field",
        "Conference": "AFC",
        logo: steelersLogo,
        division: "north",
        territory: ["Pennsylvania", "West Virginia", "West Maryland"],
        primaryColor: "#FFB612",
        secondaryColor: "#101820",
        acronym: "PIT"
    },
    "Lions": {
        "League": "NFL",
        "Team": "Detroit Lions",
        "Lat": 42.34,
        "Long": -83.045556,
        "Stadium": "Ford Field",
        "Conference": "NFC",
        logo: lionsLogo,
        division: "north",
        territory: ["Michigan"],
        primaryColor: "#B0B7BC",
        secondaryColor: "#0076B6",
        acronym: "DET"
    },
    "Cardinals": {
        "League": "NFL",
        "Team": "Arizona Cardinals",
        "Lat": 33.5275,
        "Long": -112.2625,
        "Stadium": "University of Phoenix Stadium",
        "Conference": "NFC",
        logo: cardinalsLogo,
        division: "west",
        acronym: "ARI"
    },
    "Colts": {
        "League": "NFL",
        "Team": "Indianapolis Colts",
        "Lat": 39.760056,
        "Long": -86.163806,
        "Stadium": "Lucas Oil Stadium",
        "Conference": "AFC",
        logo: coltsLogo,
        division: "south",
        acronym: "IND"
    },
    "Raiders": {
        "League": "NFL",
        "Team": "Oakland Raiders",
        "Lat": 37.751667,
        "Long": -122.200556,
        "Stadium": "Oakland Alameda Coliseum",
        "Conference": "AFC",
        logo: raidersLogo,
        division: "west",
        acronym: "OAK"
    },
    "Falcons": {
        "League": "NFL",
        "Team": "Atlanta Falcons",
        "Lat": 33.7552,
        "Long": -84.4009,
        "Stadium": "Mercedes-Benz Stadium",
        "Conference": "NFC",
        logo: falconsLogo,
        division: "south",
        acronym: "ATL"
    },
    "Texans": {
        "League": "NFL",
        "Team": "Houston Texans",
        "Lat": 29.6849,
        "Long": -95.4109,
        "Stadium": "NRG Stadium",
        "Conference": "AFC",
        logo: texansLogo,
        division: "south",
        acronym: "HOU"
    },
    "Ravens": {
        "League": "NFL",
        "Team": "Baltimore Ravens",
        "Lat": 39.2781,
        "Long": -76.6227,
        "Stadium": "M&T Bank Stadium",
        "Conference": "AFC",
        logo: ravensLogo,
        division: "north",
        acronym: "BAL"
    },
    "Chargers": {
        "League": "NFL",
        "Team": "Los Angeles Chargers",
        "Lat": 33.544,
        "Long": -117.011,
        "Stadium": "StubHub Center",
        "Conference": "AFC",
        logo: chargersLogo,
        division: "west",
        acronym: "LAC"
    },
    "Rams": {
        "Stadium": "Los Angeles Memorial Coliseum",
        "Long": "-119.0880",
        "Lat": "34.8140",
        "Team": "Los Angeles Rams",
        "League": "NFL",
        "Conference": "NFC",
        logo: ramsLogo,
        division: "west",
        acronym: "LAR"
    },
    "Bears": {
        "League": "NFL",
        "Team": "Chicago Bears",
        "Lat": 41.8623,
        "Long": -87.6167,
        "Stadium": "Soldier Field",
        "Conference": "NFC",
        logo: bearsLogo,
        division: "north",
        acronym: "CHI"
    },
    "Vikings": {
        "League": "NFL",
        "Team": "Minnesota Vikings",
        "Lat": 44.9735,
        "Long": -93.2575,
        "Stadium": "U.S. Bank Stadium",
        "Conference": "NFC",
        logo: vikingsLogo,
        division: "north",
        acronym: "MIN"
    },
}
export default nflTeams;
