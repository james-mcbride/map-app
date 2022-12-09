import React, {useEffect, useState} from "react";


function Image({imageFile, editImage, imageIdsForNewActivity}) {
    const [imageUrl, setImageUrl] = useState("")

    useEffect(() => {
        if (imageFile.image_location) {
            setImageUrl(`data:image/jpeg;base64,${imageFile.image_location}`)
        }
    }, [])

    return (
        <div className="view-trip-image-div" onClick={() => editImage(imageFile)}>
            <img src={imageUrl} className="view-trip-image" style={imageIdsForNewActivity.includes(imageFile.id) ? {opacity: 0.5}: {}}/>
        </div>
    )
}

export default Image;