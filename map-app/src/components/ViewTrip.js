import React, {useState, useEffect} from 'react'
import '../App.scss'
import axios from 'axios'
import Image from "./Image";
import ImageModal from "./ImageModal";
import ReactModal from 'react-modal';
import AllTripsMap from "./AllTripsMap";
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import nflTeams from "./utils/nflTeams";

function ViewTrip({open, tripId, onClose, onTripUpdate}) {
    // const tripId = window.location.pathname.split("/")[2];
    const [name, setName] = useState('');
    const [location, setLocation] = useState('')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('')
    const [images, setImages] = useState([])
    const [modalImage, setModalImage] = useState(null)
    const [openImageModal, setOpenImageModal] = useState(false)
    const [tripType, setTripType] = useState(null);
    const [parentTripName, setParentTripName] = useState('')
    const [parentTrips, setParentTrips] = useState([])
    const [tripActivities, setTripActivities] = useState([])
    const [openAddActivitiesModal, setOpenAddActivitiesModal] = useState(false)
    const [activityIdForImages, setActivityIdForImages] = useState(null)
    const [imageIdsForActivity, setImageIdsForActivity] = useState([])
    const [locationsClickedStatus, setLocationsClickedStatus] = useState({})
    const [childTrips, setChildTrips] = useState(null)
    const [parentTripSelected, setParentTripSelected] = useState(false)
    const [parentTripImages, setParentTripImages] = useState([])
    const [fetchedImagesForChildTrips, setFetchedImagesForChildTrips] = useState(false)
    const [selectedChildTrip, setSelectedChildTrip] = useState(tripId)
    const [editingTrip, setEditingTrip] = useState(false)
    const [id, setTripId] = useState(tripId)
    const [category, setCategory] = useState(null)
    const [categoryItem, setCategoryItem] = useState(null)

    useEffect(() => {
        if (tripId && open) {
            axios.get(`http://192.168.86.169:8090/trip/${tripId}`)
                .then(response => {
                    setLocation(response.data.location)
                    setName(response.data.name)
                    setStartDate(response.data.startDate.split(" ")[0])
                    setEndDate(response.data.endDate.split(" ")[0])
                    setTripType(response.data.tripType)
                    setParentTripName(response.data.parentTrip)
                    setCategory(response.data.category)
                    setCategoryItem(response.data.categoryItem)
                    if (response.data.activities) {
                        setTripActivities(response.data.activities)
                    }
                    if (response.data.parentTrip) {
                        getParentTrip(response.data.parentTrip)
                    }
                })
            axios.get(`http://192.168.86.169:8090/trip/${tripId}/images`)
                .then(response => {
                    if (response.data.length <= 5) {
                        setImages(response.data);
                    } else {
                        retrieveImage(response.data, 0)
                    }
                })
            axios.get(`http://192.168.86.169:8090/trip/${tripId}/activities`)
                .then(response => {
                    setTripActivities(response.data)
                })
            axios.get(`http://192.168.86.169:8090/parentTrips`)
                .then(response => {
                    setParentTrips(response.data)
                })
        }
    }, [open])

    const getParentTrip = parentTripName => {
        axios.get(`http://192.168.86.169:8090/parentTrip`, {
            params: {
                parentTripName: parentTripName
            }
        })
            .then(response => {
                setChildTrips(response.data)
                const parentTripImageMap = {}
                response.data.forEach(trip => {
                    if (trip.id !== tripId) {
                        parentTripImageMap[trip.id] = []
                    }
                })
                setParentTripImages(parentTripImageMap)
            })
    }

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

    const retrieveImagesForChildTrip = tripId => {
        axios.get(`http://192.168.86.169:8090/trip/${tripId}/images`)
            .then(response => {
                if (response.data.length <= 5) {
                    // const updatedImages = [...parentTripImages]
                    // updatedImages.concat(response.data)
                    setParentTripImages(currentParentTripImages => currentParentTripImages[tripId] = response.data);
                } else {
                    retrieveImageForChildTrip(response.data, 0)
                }
            })
    }


    function retrieveImageForChildTrip(imageList, index) {
        if (index < imageList.length) {
            axios.get(`http://192.168.86.169:8090/image/${imageList[index].id}`)
                .then(response => {
                    imageList[index].image_location = response.data.image_location
                    setParentTripImages(currentParentTripImages => {
                        const updatedParentTripImages = JSON.parse(JSON.stringify(currentParentTripImages))
                        updatedParentTripImages[response.data.trip.id] = [...imageList]
                        return updatedParentTripImages
                    })
                    retrieveImageForChildTrip(imageList, index + 1)
                })
        }
    }


    const editImage = image => {
        if (openAddActivitiesModal) {
            const imageIds = [...imageIdsForActivity]
            if (imageIds.includes(image.id)){
                setImageIdsForActivity(imageIds.filter(imageId => imageId !== image.id))
            } else {
                imageIds.push(image.id)
                setImageIdsForActivity(imageIds)
            }
        } else {
            setModalImage(image)
            setOpenImageModal(true)
        }
    }

    const deleteTrip = () => {
        axios.delete(`http://192.168.86.169:8090/trip/${id}`, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
            }
        })
            .then(() => {
                setImages([]);
                onClose({id: tripId, location: location}, true)
            })
    }

    const getProfilePictureFromImages = () => {
        if (images?.length) {
            const profilePicId = images[0].trip.trip_profile_image
            const profilePicImage = images.find(image => image.id == profilePicId)
            const selectedImage = profilePicImage ? profilePicImage : images[0]
            return {id: selectedImage, image: selectedImage.image_location}
        }
    }

    const submitTrip = () => {
        if (tripId) {
            axios.put(`http://192.168.86.169:8090/trip/${id ? id : tripId}`, {
                name: name,
                location: location,
                startDate: startDate,
                endDate: endDate,
                tripType: tripType,
                parentTrip: parentTripName,
                category: category,
                categoryItem: categoryItem
            }, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                }
            }).then(res => {
                // const updatedTripObj = res.data
                // updatedTripObj.latestProfilePic = getProfilePictureFromImages(res.data.trip_profile_image)
                res.data.trip_profile_image = getProfilePictureFromImages()?.image
                onTripUpdate(res.data);
                console.log("Request complete! response:", res);
            });
        } else {
            axios.post("http://192.168.86.169:8090/trip/create", {
                name: name,
                location: location,
                startDate: startDate,
                endDate: endDate,
                tripType: tripType,
                parentTrip: parentTripName
            }, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                }
            }).then(res => {
                window.location.replace(`http://192.168.86.169:3000/trip/${res.data.id}`);
                console.log("Request complete! response:", res);
            });
        }
    }

    const confirmThenDeleteTrip = () => {

        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this trip?.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteTrip()
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    }

    const submitImageActivities = () => {
        axios.post(`http://192.168.86.169:8090/trip/${tripId}/activities`, {
            activityId: activityIdForImages,
            imageIds: imageIdsForActivity
        }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
            }
        }).then(res => {
            console.log("Request complete! response:", res);
            const activity = images.filter(image => image?.activity?.id === activityIdForImages)[0]?.activity
            const updatedImages = images.map(image => {
                if (imageIdsForActivity.indexOf(image.id) !== -1) {
                    image.activity = activity
                }
                return image
            })
            setImages(updatedImages)
            setImageIdsForActivity([])
            setActivityIdForImages(null)
            setOpenAddActivitiesModal(false)
        });
    }


    const addImages = e => {
        const newFiles = Object.values(e.target.files)
        const reader = new FileReader();
        const loadedImages = [...images]
        const loadedImagesMap = {}
        let index = 0
        reader.onloadend = function () {
            loadedImagesMap[`${index}`] = reader.result
            axios.post(`http://192.168.86.169:8090/trip/${tripId}/images`, {
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

    const updateTripActivities = updatedImage => {
        const updatedTripActivities = [...tripActivities]
        if (updatedImage?.activity?.id && !tripActivities.map(activity => activity.id).includes(updatedImage?.activity?.id)) {
            updatedTripActivities.push(updatedImage.activity)
            setTripActivities(updatedTripActivities)
            setOpenAddActivitiesModal(true)
            setActivityIdForImages(updatedImage.activity.id)
            setImageIdsForActivity([updatedImage?.id])
        }
    }


    const closeImageModal = (updatedImage, action) => {
        setOpenImageModal(false);
        setModalImage(null)
        if (action === "update") {
            const updatedImages = images.map(image => {
                if (image.id === updatedImage.id) {
                    image = updatedImage
                }
                if (updatedImage.isProfilePicture) {
                    image.trip.trip_profile_image = updatedImage.id
                }
                return image;
            })
            setImages(updatedImages)
            updateTripActivities(updatedImage)

        } else if (action === "delete") {
            const updatedImages = images.filter(image => image.id !== updatedImage.id)
            setImages(updatedImages)
        }
    }
    const displayImages = imageList => {
        return imageList.filter(image => {
            return image.image_location
        }).map(image => {
            return <Image imageFile={image} editImage={editImage} imageIdsForNewActivity={imageIdsForActivity}
                          key={image.id}/>
        })
    }

    const displayParentTripImages = () => {
        const additionalTripImages = []
        Object.values(parentTripImages).forEach(tripImages => {
            if (tripImages) {
                additionalTripImages.push(...tripImages)
            }
        })
        const allTripImages = images.concat(additionalTripImages)
        return allTripImages.filter(image => {
            return image.image_location
        }).map(image => {
            return <Image imageFile={image} editImage={editImage} imageIdsForNewActivity={imageIdsForActivity}
                          key={image.id}/>
        })

    }

    const filterTripsForMarkerEvent = (tripLocation) => {
        setLocationsClickedStatus(obj => {
            const updatedTripLocationsObj = {...obj}
            Object.keys(updatedTripLocationsObj).forEach(location => {
                if (tripLocation !== location)
                    updatedTripLocationsObj[location] = false
            })
            updatedTripLocationsObj[tripLocation] = !updatedTripLocationsObj[tripLocation]
            return updatedTripLocationsObj
        })
    }

    const displayParentTripOptions = parentTrips.map(tripName => {
        return <option value={tripName}>{tripName}</option>
    })
    const getChildrenTripLinks = () => {
        return childTrips.map(trip => {
            return (
                <a onClick={() => {
                    setParentTripSelected(false)
                    setLocation(trip.location)
                    setName(trip.name)
                    setStartDate(trip.startDate.split(" ")[0])
                    setEndDate(trip.endDate.split(" ")[0])
                    setTripType(trip.tripType)
                    setParentTripName(trip.parentTrip)
                    setSelectedChildTrip(trip.id)
                    setTripId(trip.id)
                    if (trip.activities) {
                        setTripActivities([...tripActivities])
                    }
                }}>{trip.name}</a>
            )
        })
    }

    const displayTripImages = (childTripId, parentTripSelectedBoolean) => {
        if (parentTripSelected) {
            return displayParentTripImages()
        } else if (fetchedImagesForChildTrips && !parentTripSelectedBoolean && childTripId !== tripId) {
            return displayImages(parentTripImages[childTripId] ? parentTripImages[childTripId] : [])
        } else {
            return displayImages(images)
        }
    }

    const getLatestTripWithProfilePictureWhenClosing = () => {
        const profilePic = getProfilePictureFromImages()
        return {id: tripId, profilePicture: profilePic.image, profilePictureId: profilePic.id}
    }

    const locationActivityList = images.map(image => image?.activity?.location).filter(activityLocation => activityLocation)
    const locationList = locationActivityList?.length > 0 ? locationActivityList : [location]
    return (
        <ReactModal isOpen={open} className="view-trip-modal">
            <div >
                {openAddActivitiesModal && <div id="add-activities-popup">
                    Add activity to other images: {imageIdsForActivity.length} selected <br/>
                    <button onClick={() => {
                        setOpenAddActivitiesModal(false)
                        setImageIdsForActivity([])
                        setParentTripSelected(false)
                    }}>Cancel
                    </button>
                    <button onClick={submitImageActivities}>Done</button>
                </div>}
                <div id="view-trip-header">
                    <div id="view-trip-header-title">
                        <h2>{parentTripSelected ? parentTripName : name}</h2>
                        <h4 id="view-trip-location">{location} — <span>{startDate} - {endDate}</span></h4>
                        {
                            parentTripSelected ? <div id="children-trip-links">{getChildrenTripLinks()}</div> :
                                parentTripName ? <a type="text" onClick={() => {
                                    setParentTripSelected(true)
                                    childTrips.forEach((trip) => {
                                        if (trip.id !== tripId && !fetchedImagesForChildTrips) {
                                            retrieveImagesForChildTrip(trip.id)
                                        }
                                    })
                                    setFetchedImagesForChildTrips(true)
                                }}>{parentTripName}</a> : null
                        }
                    </div>
                    {!editingTrip && <button id="edit-trip-button" onClick={() => setEditingTrip(true)}>
                        Edit Trip
                    </button>}
                    {(!parentTripSelected && editingTrip) && <button id="submit-trip-button" onClick={submitTrip}>
                        {tripId ? "Update Trip!" : "Create trip!"}
                    </button>}
                    <button id="go-home-button" onClick={() => {
                        setImages([]);
                        if (images?.length) {
                            onClose(getLatestTripWithProfilePictureWhenClosing(), false)
                        } else{
                            onClose()
                        }
                        setParentTripSelected(false)
                        setFetchedImagesForChildTrips(false)
                        setEditingTrip(false)
                    }}>
                        Close
                    </button>

                    {(!parentTripSelected && editingTrip) &&
                    <button id='delete-trip-button' onClick={() => confirmThenDeleteTrip()}>
                        Delete Trip
                    </button>}
                </div>
                <div style={{width: "100%"}}>
                    <AllTripsMap
                        initialZoomLevel={10}
                        includeZoom={true}
                        locations={locationList && !parentTripSelected ? locationList : childTrips.map(trip => trip.location)}
                        onMarkerEvent={filterTripsForMarkerEvent}
                        locationsClickedStatus={locationsClickedStatus}
                        location={location}
                        viewingMultipleTrips={parentTripSelected}
                    />
                </div>
                {(!parentTripSelected && editingTrip) && <div className="createTrip">
                    <div id="tripInfo">
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
                                <input id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)}
                                       type="date"/>
                            </label>
                        </div>
                        <label htlmFor="category">
                            Category
                            <select id="category" value={category}
                                    onChange={e => setCategory(e.target.value)}>
                                <option value="">Select a category</option>
                                <option>NFL</option>
                            </select>
                        </label>
                        {category === "NFL" && (
                            <label htlmFor="categoryItem">
                                NFL Team Visited
                                <select id="categoryItem" value={categoryItem}
                                        onChange={e => setCategoryItem(e.target.value)}>
                                    {Object.keys(nflTeams).sort().map(team => {
                                        return <option>{team}</option>
                                    })}
                                </select>
                            </label>
                        )}
                        {tripId && (<input
                            type="file"
                            id="file-upload"
                            onChange={addImages}
                            multiple
                        />)}
                        <div className="tripTypeDiv">
                            <label htlmFor="parentTripCheckbox">
                                Trip type
                                <select id="parentTripSelect" value={tripType}
                                        onChange={e => setTripType(e.target.value)}>
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
                    </div>
                </div>
                }
                {tripId && (<div id="view-trip-images">
                    {displayTripImages(selectedChildTrip, parentTripSelected)}
                </div>)}
                <ImageModal modalImage={modalImage} open={openImageModal} onClose={closeImageModal} tripActivities
                            imageActivity={modalImage?.activity} activities={tripActivities} editingTrip={editingTrip}/>
            </div>
        </ReactModal>
    )
}

export default ViewTrip;
