import React, {useState} from 'react';
import ReactModal from 'react-modal';
import axios from "axios";

function ImageModal({open, modalImage, onClose}) {
    const [imageDescription, setImageDescription] = useState(modalImage?.description ? modalImage?.description : "")
    const [isProfilePicture, setIsProfilePicture] = useState(modalImage?.trip?.trip_profile_image === modalImage?.id)

    const clearState = () => {
        setImageDescription("")
        setIsProfilePicture(null)
    }
    const saveImage = () => {
        axios.put(`http://192.168.86.50:8090/image/${modalImage.id}`, {
            description: imageDescription,
            isProfilePicture: isProfilePicture,
        }).then(res => {
            console.log("Updated image! response:", res);
        });
        modalImage.description = imageDescription;
        clearState();
        onClose(modalImage, "update")
    }

    const deleteImage = () => {
        axios.delete(`http://192.168.86.50:8090/image/${modalImage.id}`)
            .then(res => {
                console.log("deleted image! response:", res);
            });
        clearState();
        onClose(modalImage, "delete")
    }

    return (
        <ReactModal isOpen={open} id="view-image-modal">
            <div id="view-image-modal-div">
                <button id="close-image-modal-button" onClick={() => {
                    clearState();
                    onClose();
                }}>
                    Close
                </button>
                <img src={`data:image/jpeg;base64,${modalImage?.image_location}`}/>
            </div>
            <div id="image-modal-input">
                <label>
                    Image Description:
                    <input value={imageDescription} onChange={e => setImageDescription(e.target.value)}/>
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

        </ReactModal>
    )
}

export default ImageModal