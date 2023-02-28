import React, {useState, useEffect} from 'react';
import ReactModal from 'react-modal';
import axios from "axios";

function ImageModal({open, modalImage, onClose, activities, imageActivity, editingTrip}) {
    const [imageDescription, setImageDescription] = useState(modalImage?.description ? modalImage?.description : "")
    const [isProfilePicture, setIsProfilePicture] = useState(modalImage?.trip?.trip_profile_image === modalImage?.id)
    const [activityName, setActivityName] = useState(modalImage?.activity?.name)
    const [activityLocation, setActivityLocation] = useState(modalImage?.activity?.location)
    const [activityId, setActivityId] = useState(modalImage?.activity?.id)
    const [editingImage, setEditingImage] = useState(false)

    useEffect(() => {
        if (modalImage) {
            setImageDescription(modalImage?.description)
            setIsProfilePicture(modalImage?.trip?.trip_profile_image === modalImage?.id)
            setActivityName(modalImage?.activity?.name)
            setActivityLocation(modalImage?.activity?.location)
            setActivityId(modalImage?.activity?.id)
        }
    }, [modalImage])


    const clearState = () => {
        setImageDescription(null)
        setIsProfilePicture(null)
        setActivityLocation(null)
        setActivityName(null)
        setActivityId(null)
        setEditingImage(false)
    }
    const saveImage = () => {
        axios.put(`http://192.168.86.134:8090/image/${modalImage.id}`, {
            description: imageDescription,
            isProfilePicture: isProfilePicture ? true : false,
            activityId: activityId,
            activityLocation: activityLocation,
            activityName: activityName
        }).then(res => {
            const updatedImage = res.data
            modalImage.description = imageDescription;
            modalImage.activity = updatedImage?.activity
            clearState();
            onClose(modalImage, "update")
        });
    }

    const deleteImage = () => {
        axios.delete(`http://192.168.86.134:8090/image/${modalImage.id}`)
            .then(res => {
                console.log("deleted image! response:", res);
            });
        clearState();
        onClose(modalImage, "delete")
    }

    const activityOptions = () => {
        let activityList = [{id: "", name: "none"}]
        if (activities) {
            activityList = activityList.concat(...activities)
        }
        return activityList.map(activity => {
            return <option value={activity.id}>{activity.name}</option>
        })
    }
    return (
        <ReactModal isOpen={open} id="view-image-modal">
            <div id="view-image-modal-div" style={!editingImage ? {height: "88%"} : {}}>
                <button id="edit-image-modal-button" onClick={() => setEditingImage(!editingImage)}>
                    {editingImage ? "View Image" : "Edit Image"}
                </button>
                <button id="close-image-modal-button" onClick={() => {
                    clearState();
                    onClose();
                }}>
                    Close
                </button>
                <img src={`data:image/jpeg;base64,${modalImage?.image_location}`}/>
            </div>
            {editingImage ? <div>
                    <div id="image-modal-input">
                        <label>
                            Image Description:
                            <input value={imageDescription} onChange={e => setImageDescription(e.target.value)}/>
                        </label>

                    </div>
                    <div id="image-modal-activity">
                        <label htlmFor="activitySelect">
                            Activity
                            <select id="activitySelect" value={activityId} onChange={e => {
                                setActivityId(e.target.value)
                                activities.forEach(activity => {
                                    if (activity.id === e.target.value) {
                                    }
                                    setActivityLocation(activity.location)
                                    setActivityName(activity.name)
                                })
                            }}>
                                {activityOptions()}
                            </select>
                        </label>
                        <label htmlFor="newActivityNameInput">
                            Activity Name
                            <input id="newActivityNameInput" value={activityName}
                                   onChange={e => setActivityName(e.target.value)}/>
                        </label>
                        <label htmlFor="newActivityLocationInput">
                            Activity Location
                            <input id="newActivityLocationInput" value={activityLocation}
                                   onChange={e => setActivityLocation(e.target.value)}/>
                        </label>
                    </div>
                    <div id="save-image-div">
                        <label>
                            Profile Picture:
                            <input type="checkbox" value={isProfilePicture}
                                   onChange={e => setIsProfilePicture(e.target.checked)}/>
                        </label>
                        <button onClick={saveImage}>
                            Save photo
                        </button>
                        <button onClick={deleteImage}>
                            Delete photo
                        </button>
                    </div>
                </div> :
                <div style={{textAlign: "center"}}>
                    <h2>{imageDescription}</h2>
                    {activityName ?
                        <h4 id="view-trip-image">{activityName} — <span>{activityLocation}</span></h4> : null}
                </div>
            }

        </ReactModal>
    )
}

export default ImageModal