import React, {useState, useEffect} from 'react'
import '../App.scss'
import Map from './Map'
import axios from 'axios'
import Image from "./Image";
import ImageModal from "./ImageModal";

function ViewTrip({}) {
    const tripId = window.location.pathname.split("/")[2];
    const [name, setName] = useState('');
    const [location, setLocation] = useState('')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('')
    const [images, setImages] = useState([])
    const [modalImage, setModalImage] = useState(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (tripId) {
            axios.get(`http://192.168.86.57:8090/trip/${tripId}`)
                .then(response => {
                    setLocation(response.data.location)
                    setName(response.data.name)
                    setStartDate(response.data.startDate.split(" ")[0])
                    setEndDate(response.data.endDate.split(" ")[0])
                })
            axios.get(`http://192.168.86.57:8090/trip/${tripId}/images`)
                .then(response => {
                    if (response.data.length <= 5) {
                        setImages(response.data);
                    } else {
                        retrieveImage(response.data, 0)
                    }
                })
        }
    }, [])

    function retrieveImage(imageList, index) {
        if (index < imageList.length) {
            axios.get(`http://192.168.86.57:8090/image/${imageList[index].id}`)
                .then(response => {
                    imageList[index].image_location = response.data.image_location
                    setImages([...imageList])
                    retrieveImage(imageList, index + 1)
                })
        }
    }

    const editImage = image => {
        setModalImage(image)
        setOpen(true)
    }


    const submitTrip = () => {
        if (tripId) {
            axios.put("http://192.168.86.57:8090/trip/create", {
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
        } else {
            axios.post("http://192.168.86.57:8090/trip/create", {
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
                window.location.replace(`http://192.168.86.57:3000/trip/${res.data.id}`);
                console.log("Request complete! response:", res);
            });
        }
    }

    const addImages = e => {
        const newFiles = Object.values(e.target.files)
        const reader = new FileReader();
        const loadedImages = [...images]
        const loadedImagesMap = {}
        let index = 0
        reader.onloadend = function () {
            loadedImagesMap[`${index}`] = reader.result
            axios.post(`http://192.168.86.57:8090/trip/${tripId}/images`, {
                image: reader.result.split(",")[1],
                description: `${index}`
            })
                .then(res => {
                    const image = res.data
                    image.image_location = loadedImagesMap[image.description]?.replace("data:image/jpeg;base64,", "")
                    loadedImages.push(image)
                    setImages([...loadedImages])
                })
            index += 1
            if (index < newFiles.length) {
                reader.readAsDataURL(newFiles[index])
            }
        }
        reader.readAsDataURL(newFiles[0])
    }

    const closeImageModal = (updatedImage, action) => {
        setOpen(false);
        setModalImage(null)
        if (action === "update") {
            const updatedImages = images.map(image => {
                image.trip.trip_profile_image = updatedImage.id
                return image;
            })
            setImages(updatedImages)
        } else if (action === "delete") {
            const updatedImages = images.filter(image => image.id !== updatedImage.id)
            setImages(updatedImages)
        }
    }
    const displayImages = imageList => {
        return imageList.filter(image => {
            return image.image_location
        }).map(image => {
            return <Image imageFile={image} editImage={editImage}/>
        })
    }

    return (
        <div style={{width: "100%"}}>
            <div id="view-trip-header">
                <h2>{name}</h2>
                <button id="submit-trip-button" onClick={submitTrip}>
                    {tripId ? "Update Trip!" : "Create trip!"}
                </button>
                <button id="go-home-button" onClick={submitTrip}>
                    <a href="/">
                        Home
                    </a>
                </button>
            </div>
            <div style={{width: "100%"}}>
                <Map location={location}/>
            </div>
            <div
                className="createTrip">
                <div
                    id="tripInfo">
                    <div className="trip-info-input">
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
                    </div>
                    <div className="trip-info-input">
                        <label htmlFor="location">
                            Location
                            <input id="location" value={location} onChange={e => setLocation(e.target.value)}/>
                        </label>
                    </div>
                    <div className="trip-info-input">
                        <label htmlFor="startDate">
                            Start Date
                            <input id="startDate" value={startDate} onChange={e => {
                                setStartDate(e.target.value)
                                setEndDate(e.target.value)

                            }}
                                   type="date"/>
                        </label>
                    </div>
                    <div className="trip-info-input">
                        <label htmlFor="endDate">
                            End Date
                            <input id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} type="date"/>
                        </label>
                    </div>
                    <div></div>
                    {tripId && (<input
                        type="file"
                        id="file-upload"
                        onChange={addImages}
                        multiple
                    />)}
                </div>
            </div>
            {tripId && (<div id="view-trip-images">
                {displayImages(images)}
            </div>)}
            <ImageModal modalImage={modalImage} open={open} onClose={closeImageModal} />
        </div>
    )
}

export default ViewTrip;
