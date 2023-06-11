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
import heic2any from 'heic2any'

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
    const [categoryItemDetail1, setCategoryItemDetail1] = useState(null)
    const [categoryItemDetail2, setCategoryItemDetail2] = useState(null)
    const [categoryItemDetail3, setCategoryItemDetail3] = useState(null)
    const [selectedActivity, setSelectedActivity] = useState(null)
    const [lastImageIndexRetrieved, setLastImageIndexRetrieved] = useState(null)


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
                    setCategoryItemDetail1(response.data.categoryItemDetail1 ? response.data.categoryItemDetail1 : '')
                    setCategoryItemDetail2(response.data.categoryItemDetail2 ? response.data.categoryItemDetail2 : '')
                    setCategoryItemDetail3(response.data.categoryItemDetail3 ? response.data.categoryItemDetail3 : '')

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
                        retrieveImage(response.data, 0, 12)
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
        if (!open) {
            setSelectedActivity(null)
            setLastImageIndexRetrieved(null)
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

    function retrieveImage(imageList, index, indexToStopOn) {
        if (index < indexToStopOn && index < imageList.length) {
            axios.get(`http://192.168.86.169:8090/image/${imageList[index].id}`)
                .then(response => {
                    imageList[index].image_location = response.data.image_location
                    setImages([...imageList])
                    retrieveImage(imageList, index + 1, indexToStopOn)
                })
        } else {
            setLastImageIndexRetrieved(index)
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
            if (imageIds.includes(image.id)) {
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
                categoryItem: categoryItem,
                categoryItemDetail1: categoryItemDetail1,
                categoryItemDetail2: categoryItemDetail2,
                categoryItemDetail3: categoryItemDetail3
            }, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                }
            }).then(res => {
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

    const addImages = async e => {
        const files = Object.values(e.target.files)
        const lastImageIndexRetrievedNum = lastImageIndexRetrieved ? lastImageIndexRetrieved : 0
        setLastImageIndexRetrieved(lastImageIndexRetrievedNum + files.length)
        const newFiles = await Promise.all(files.map(async file => {
            let updatedFile = file
            if (file.type.includes("heic")) {
                let blob = file //ev.target.files[0];
                await heic2any({
                    blob: blob,
                    toType: "image/jpg",
                })
                    .then(function (resultBlob) {
                        updatedFile = new File([resultBlob], "heic" + ".jpg", {
                            type: "image/jpeg",
                            lastModified: new Date().getTime()
                        });
                        return updatedFile
                    })
                    .catch(function (x) {
                        console.log(x.code);
                        console.log(x.message);
                    });
            }
            return updatedFile;
        }))
        const reader = new FileReader();
        const loadedImages = [...images]
        const loadedImagesMap = {}
        let index = 0
        reader.onloadend = function () {
            loadedImagesMap[`${index}`] = reader.result
            axios.post(`http://192.168.86.169:8090/trip/${tripId}/images`, {
                fileType: reader.result.split(";")[0].replace("data:", "").replace("quicktime", "mp4"),
                image: reader.result.split(",")[1],
                description: `${index}`
            })
                .then(res => {
                    const image = res.data
                    image.image_location = loadedImagesMap[image.description]?.replace("data:image/jpeg;base64,", "")
                    loadedImages.unshift(image)
                    setImages([...loadedImages])
                })
            index += 1
            if (index < newFiles.length) {
                reader.readAsDataURL(newFiles[index])
            }
        }
        await reader.readAsDataURL(newFiles[0])
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
            return image.image_location && (!selectedActivity || image?.activity?.location === selectedActivity)
        }).map((image, index) => {
            return <Image
                imageFile={image}
                editImage={editImage}
                imageIdsForNewActivity={imageIdsForActivity}
                key={image.id}
                imageIsInView={() => {
                    if (lastImageIndexRetrieved - index === 4) {
                        retrieveImage(images, lastImageIndexRetrieved, lastImageIndexRetrieved + 8)
                    }
                }
                }/>
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
            return image.image_location && (!selectedActivity || image.trip.location === selectedActivity)
        }).map(image => {
            return <Image imageFile={image} editImage={editImage} imageIdsForNewActivity={imageIdsForActivity}
                          key={image.id}/>
        })

    }

    const filterTripsForMarkerEvent = (tripLocation) => {
        setLocationsClickedStatus(obj => {
            const currentTripLocationsObj = {...obj}
            const updatedTripLocationsObj = {}
            Object.keys(currentTripLocationsObj).forEach(location => {
                if (tripLocation !== location)
                    updatedTripLocationsObj[location] = false
            })
            const selectedTripLocationStatus = !currentTripLocationsObj[tripLocation]
            updatedTripLocationsObj[tripLocation] = selectedTripLocationStatus
            setSelectedActivity(selectedTripLocationStatus ? tripLocation : null)
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
                    setSelectedActivity(null)
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
            <div>
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
                                    setSelectedActivity(null)
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
                        } else {
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
                        {category === "NFL" && (
                            <label htlmFor="categoryItemDetail1">
                                Away Team
                                <select id="categoryItemDetail1" value={categoryItemDetail1}
                                        onChange={e => setCategoryItemDetail1(e.target.value)}>
                                    {Object.keys(nflTeams).sort().map(team => {
                                        return <option>{team}</option>
                                    })}
                                </select>
                            </label>
                        )}
                        {category === "NFL" && (
                            <label htlmFor="categoryItemDetail2">
                                Home Team Score
                                <input id="categoryItemDetail2" value={categoryItemDetail2}
                                       onChange={e => setCategoryItemDetail2(e.target.value)}/>
                            </label>
                        )}
                        {category === "NFL" && (
                            <label htlmFor="categoryItemDetail3">
                                Away Team Score
                                <input id="categoryItemDetail3" value={categoryItemDetail3}
                                       onChange={e => setCategoryItemDetail3(e.target.value)}/>

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
                {(tripId && selectedActivity) && (
                    <h1 style={{textAlign: "center"}}>{selectedActivity}</h1>
                )}
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
