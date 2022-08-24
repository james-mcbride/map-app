import React, {useState, useEffect} from 'react'
import '../App.scss'
import Map from './Map'
import axios from 'axios'

function ViewTrip() {
    const tripId = window.location.pathname.split("/")[2];
    const [name, setName] = useState('');
    const [location, setLocation] = useState('')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('')
    const [images, setImages] = useState([])

    useEffect(() => {
        axios.get(`http://192.168.86.46:8090/trip/${tripId}`)
            .then(response => {
                setLocation(response.data.location)
                setName(response.data.name)
                setStartDate(response.data.startDate.split(" ")[0])
                setEndDate(response.data.endDate.split(" ")[0])
            })
    }, [])


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
            }
        }).then(res => {
            console.log("Request complete! response:", res);
        });
    }

    const addImages = e => {
        const newFiles = Object.values(e.target.files)
        console.log(newFiles)
        const reader = new FileReader();
        const loadedImages = []
        let index = 0
        reader.onloadend = function () {
            loadedImages.push(reader.result)
            setImages(loadedImages)
            axios.post(`http://192.168.86.46:8090/trip/${tripId}/images`, {
                image: reader.result.split(",")[1]
            })
            index +=1
            if (index<newFiles.length) {
                reader.readAsDataURL(newFiles[index])
            }
        }
        reader.readAsDataURL(newFiles[0])
    }

const displayImages = images.map(image => {
        return (
            <div>
                <img src={image} style={{width: 500, height: 500, objectFit: "contain"}}/>
            </div>
        )
    })

return (
    <div>
        <div
            className="createTrip">
            <div
                id="tripInfo">
                <label
                    htmlFor="name">
                    Trip
                    Name
                    <input
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
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
                <input
                    type="file"
                    id="file-upload"
                    onChange={addImages}
                    multiple
                />
            </div>
            <div style={{width: " 70%"}}>
                <Map location={location}/>
            </div>
        </div>
        <div style={{display:"flex"}}>
            {displayImages}
        </div>
    </div>
)
}

export default ViewTrip;
