import React, {useState, useEffect} from 'react'
import '../App.scss'
import Map from './Map'
import axios from 'axios'
import { browserHistory } from 'react-router';

function CreateTrip() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('')


    const submitTrip = () => {
        axios.post("http://192.168.86.46:8090/trip/create", {
                name: name,
                location: location,
                startDate: startDate,
                endDate: endDate
        }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                'Origin': 'http://localhost:3000/'
            }
        }).then(res => {
            console.log("Request complete! response:", res);
            window.location.replace(`http://192.168.86.46:3000/trip/${res.data.id}`);
        });
    }

    return (
        <div className="createTrip">
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
                    <input id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} type="date"/>
                </label>
                <br/>
                <label htmlFor="endDate">
                    End Date
                    <input id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} type="date"/>
                </label>
                <br/>
                <button onClick={submitTrip}>
                    Create trip!
                </button>
            </div>
            <div style={{width:" 70%"}}>
                <Map location={location}/>
            </div>
        </div>
    );
}

export default CreateTrip;
