import React from 'react';
import ReactModal from 'react-modal';

function ImageModal({open, modalImage, onClose}) {
    return (
        <ReactModal isOpen={open} id="view-image-modal">
            <div id="view-image-modal-div">
                <button id="close-image-modal-button" onClick={onClose}>
                    Close
                </button>
                <img src={`data:image/jpeg;base64,${modalImage?.image_location}`} />
            </div>
        </ReactModal>
    )
}

export default ImageModal