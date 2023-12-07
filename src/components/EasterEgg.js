import React, { useState, useEffect } from 'react';

const EasterEgg = ({ setEasterEggOpen }) => {

    const [transition, setTransition] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(0.750);
    const [scale, setScale] = useState(0);

    useEffect(() => {
        show();
    }, []);

    const show = () => {
        var audio = new Audio(chrome.runtime.getURL("assets/sounds/easter_egg.mp3"));
        audio.volume = 0.05;
        audio.play();

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
            setEasterEggOpen(false);
        }, 300);
    }

    return (
        <div className="easterEggBg" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundColor})` }} onClick={() => close()}>
            <div className={"easterEggContainer" + (transition ? ' active' : '')} style={{ transform: `scale(${scale})` }} onClick={(e) => e.stopPropagation()}>
                <div className='header'>
                    <h1>EASTER EGG !</h1>
                    <div className="closeBtn">
                        <img onClick={() => close()} src="./assets/icones/cross.png" alt="Croix" />
                    </div>
                </div>
                <div className='body'>
                    <p>
                        Bien joué, tu as trouvé l'easter egg !<br></br><br></br>
                        Ça ne sert absolument à rien, mais tu peux en être fier !<br></br>
                        N'hésite pas à me partager ta découverte sur Twitter/X, ça me ferait plaisir 🤙
                        <br></br>
                    </p>

                    <a href={"https://www.x.com/tsuyobnha"} style={{ textDecoration: "none", display: "inline-block" }} target='_blank'>
                        <p className="x">@tsuyobnha</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EasterEgg;