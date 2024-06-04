import React, { useState, useEffect } from "react";

const ZoomImage = (props) => {
    const [backgroundOpacity, setBackgroundOpacity] = useState(0.750);
    const [scale, setScale] = useState(props.instant ? 1 : 0);

    useEffect(() => {
        setTimeout(() => {
            setScale(1);
        }, 10);
    }, []);

    const close = () => {
        setBackgroundOpacity(0);
        setScale(0);
        setTimeout(() => {
            props.setOpen(false);
        }, 300);
    }

    return (
        <div className="zoomImageBackground" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})` }} onClick={() => close()}>
            <img src={props.src} alt={props.alt} style={{
                transform: `scale(${scale})`,
                maxWidth: props.width || "240px",
                minWidth: "100px",
                maxHeight: props.height || "240px",
                minHeight: "100px"
            }} />
        </div>
    );
};

export default ZoomImage;