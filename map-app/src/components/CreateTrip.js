import React, {useState, useEffect} from 'react'
import '../App.scss'
import Map from './Map'
import axios from 'axios'
import ReactModal from "react-modal";

function CreateTrip({open, onClose}) {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tripType, setTripType] = useState(null);
    const [parentTripName, setParentTripName] = useState('')
    const [parentTrips, setParentTrips] = useState([])

    useEffect(() => {
        if (open){
            axios.get(`http://localhost:8090/parentTrips`)
                .then(response => {
                    setParentTrips(response.data)
                })
        }
    }, [open])

    const submitTrip = () => {
        axios.post("http://localhost:8090/trip/create", {
            name: name,
            location: location,
            startDate: startDate,
            endDate: endDate
        }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
            }
        }).then(response => {
            onClose(response.data)
        });
    }

    const displayParentTripOptions = parentTrips.map(tripName => {
        return <option value={tripName}>{tripName}</option>
    })

    return (
        <ReactModal isOpen={open}>
            <div className="createTrip">
                <button id="go-home-button" onClick={onClose}>
                    Close
                </button>
                <div id="create-trip-info">
                <div id="tripInfo">
                    <label htmlFor="name">
                        Trip Name
                        <input id="name" value={name} onChange={e => setName(e.target.value)}/>
                    </label>
                    <br/>
                    <label htmlFor="location">
                        Location
                        <input id="location" value={location} onChange={e => setLocation(e.target.value)}/>
                    </label>
                    <br/>
                    <label htmlFor="startDate">
                        Start Date
                        <input id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)}
                               type="date"/>
                    </label>
                    <br/>
                    <label htmlFor="endDate">
                        End Date
                        <input id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} type="date"/>
                    </label>
                    <div className="tripTypeDiv">
                        <label htlmFor="parentTripCheckbox">
                            Trip type
                            <select id="parentTripSelect" value={tripType} onChange={e => setTripType(e.target.value)}>
                                <option value="">Single Location Trip</option>
                                <option value="parentTrip">Parent Trip</option>
                                <option value="childTrip">Child Trip</option>
                            </select>
                        </label>
                        {tripType === 'parentTrip' && (<label htmlFor="parentTripInput">
                            Parent Trip Name
                            <input id='parentTripInput' value={parentTripName}
                                   onChange={e => setParentTripName(e.target.value)}/>
                        </label>)}
                        {tripType === 'childTrip' && (<label htmlFor="parentTripNameDropdown">
                            Parent Trip Name
                            <select id="parentTripNameDropdown" value={parentTripName}
                                    onChange={e => setParentTripName(e.target.value)}>
                                {displayParentTripOptions}
                            </select>
                        </label>)}
                    </div>
                    <br/>

                </div>
                    <button onClick={submitTrip} style={{width: 200}}>
                        Create trip!
                    </button>
                </div>
                <div style={{width: " 70%"}}>
                    <Map location={location}/>
                </div>
            </div>
        </ReactModal>
    );
}

export default CreateTrip;
