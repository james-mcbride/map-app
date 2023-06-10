import React, {useEffect, useRef, useState} from "react";
import VisibilitySensor from 'react-visibility-sensor';

function Image({imageFile, editImage, imageIdsForNewActivity}) {
    const [imageUrl, setImageUrl] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const videoRef = useRef(null);

    useEffect(() => {
        if (imageFile.image_location) {
            const fileType = imageFile.fileType ? `data:${imageFile.fileType};base64` : "data:image/jpeg;base64"
            const imageUrl = imageFile.image_location.includes("data:") ? imageFile.image_location : `${fileType},${imageFile.image_location}`
            setImageUrl(imageUrl)
        }
    }, [])

    useEffect(() => {
        if (videoRef.current) {
            if (isVisible) {
                videoRef.current.play();
            } else {
                if (videoRef.current.play) {
                    videoRef.current.pause();
                }
            }
        }
    }, [isVisible, videoRef]);

    return (
        <VisibilitySensor onChange={(isVisible) => setIsVisible(isVisible)}>
        <div className="view-trip-image-div" onClick={() => editImage(imageFile)}>
            {imageFile.fileType?.includes("video") ? <video
                    src={imageUrl} className="view-trip-image"
                    style={imageIdsForNewActivity.includes(imageFile.id) ? {opacity: 0.5} : {}}
                    controls
                    ref={videoRef}
                /> :
                <img src={imageUrl} className="view-trip-image"
                     style={imageIdsForNewActivity.includes(imageFile.id) ? {opacity: 0.5} : {}}/>
            }
        </div>
        </VisibilitySensor>
    )
}

export default Image;