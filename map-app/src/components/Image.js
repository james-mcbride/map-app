import React, {useEffect, useRef, useState} from "react";
import VisibilitySensor from 'react-visibility-sensor';

function Image({imageFile, editImage, imageIdsForNewActivity}) {
    const [imageUrl, setImageUrl] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const videoRef = useRef(null);

    useEffect(() => {
        if (imageFile.image_location) {
            const fileType = imageFile.fileType === "video/quicktime" ? "data:video/mp4;base64" : "data:image/jpeg;base64"
            setImageUrl(`${fileType},${imageFile.image_location}`)
        }
    }, [])

    useEffect(() => {
        if (isVisible) {
            videoRef.current.play();
        } else {
            if (videoRef.current.play) {
                videoRef.current.pause();
            }
        }
    }, [isVisible]);

    return (
        <VisibilitySensor onChange={(isVisible) => setIsVisible(isVisible)}>
        <div className="view-trip-image-div" onClick={() => editImage(imageFile)}>
            {imageFile.fileType === "video/quicktime" ? <video
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