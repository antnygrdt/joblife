import React, { useState, useEffect } from 'react';

const Image = ({ setImageOpen, player }) => {
    const [transition, setTransition] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(0.750);
    const [scale, setScale] = useState(0);

    useEffect(() => {
        show();
    }, []);

    const show = () => {
        setTransition(true);
        setScale(1);
        setTimeout(() => {
            setTransition(false);
        }, 300);
    };

    const close = () => {
        setTransition(true);
        setBackgroundColor(0);
        setScale(0);
        setTimeout(() => {
            setImageOpen(false);
        }, 300);
    }

    return (
        <div className="imageBg" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundColor})` }} onClick={() => close()}>
            <div className={"imageContainer" + (transition ? ' active' : '')} style={{ transform: `scale(${scale})` }} onClick={(e) => e.stopPropagation()}>
                <img src={player.avatar} alt={player.name} />
            </div>
        </div>
    );
};

export default Image;