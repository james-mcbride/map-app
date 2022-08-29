import React, {useEffect, useState} from "react";


function Image({imageFile, editImage}) {
    const [imageUrl, setImageUrl] = useState("")

    useEffect(() => {
        if (imageFile.image_location) {
            setImageUrl(`data:image/jpeg;base64,${imageFile.image_location}`)
        }
    }, [])

    return (
        <div className="view-trip-image-div" onClick={() => editImage(imageFile)}>
            <img src={imageUrl} className="view-trip-image"/>
        </div>
    )
}

export default Image;