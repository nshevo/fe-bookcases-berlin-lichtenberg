import React, { useEffect, useRef, useState } from 'react';
import { Overlay } from 'ol';

const OpenLayersPopup = ({ map, coordinates, name, address }) => {
    const popupRef = useRef(null);
    const [popup, setPopup] = useState(null);

    const popupStyle = {
        backgroundColor: "rgb(255 255 255 / 57%)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #cccccc",
        minWidth: "250px",
        color: "black",
        display: 'block',
    };

    useEffect(() => {
        if (!map || !coordinates || !name || !address) return;

        const newPopup = new Overlay({
            id: "popup",
            element: popupRef.current,
            position: coordinates,
        });

        if (popup) {
            map.removeOverlay(popup);
        }
    
        map.addOverlay(newPopup);
        setPopup(newPopup);

        return () => {
            if (popup) {
                map.removeOverlay(popup);
            }
        };
    }, [map, coordinates, name, address]);

    const handleCloseClick = () => {
        if (popup) {
            map.removeOverlay(popup);
        }
    };

    return (
        <div ref={popupRef} style={popupStyle} className="ol-popup">            
            <div
                onClick={handleCloseClick}
                style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    position: "absolute",
                    top: "2px",
                    right: "8px",
                }}
            >
                ✖
            </div>
            <p>{name}</p>
            <br />
            <p>{address}</p>
        </div>
    );
};

export default OpenLayersPopup;
