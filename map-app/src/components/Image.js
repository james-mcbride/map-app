import React, {useEffect, useRef, useState} from "react";
import VisibilitySensor from 'react-visibility-sensor';
import playButton from './images/play-button-svgrepo-com.svg'

function Image({imageFile, editImage, imageIdsForNewActivity, imageIsInView}) {
    const [imageUrl, setImageUrl] = useState("")
    const [isVisible, setIsVisible] = useState(true)
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

    const style = {}

    if (imageIdsForNewActivity.includes(imageFile.id)) {
        style.opacity = 0.5
    }

    // if (imageFile.videoCoverImage ) {
    //     style.transform = "rotate(90deg)"
    // }

    console.log(style);

    return (
        <VisibilitySensor partialVisibility onChange={(isVisible) => {
            if (typeof imageIsInView == 'function') {
                imageIsInView()
            }
            setIsVisible(isVisible)
        }}
        >

            <div className="view-trip-image-div" onClick={() => editImage(imageFile)}>
                {imageFile?.videoCoverImage ? (<div className="play-button">
                    <img src={playButton}/>
                </div>) : null}

                {imageFile.fileType?.includes("video") ? <video
                        src={imageUrl} className="view-trip-image"
                        style={imageIdsForNewActivity.includes(imageFile.id) ? {opacity: 0.5} : {}}
                        controls
                        ref={videoRef}
                        preload="metadata"
                    /> :
                    <img src={isVisible ? imageUrl : ""} className="view-trip-image"
                         style={style}/>
                }
            </div>
        </VisibilitySensor>
    )
}

export default Image;