import React, { useState } from 'react';

const Welcome = ({ setOpenWelcome }) => {

    const [transition, setTransition] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(0.750);
    const [scale, setScale] = useState(1);

    const close = () => {
        setTransition(true);
        setBackgroundColor(0);
        setScale(0);
        setTimeout(() => {
            setOpenWelcome(false);
        }, 300);
    }

    return (
        <div className="welcomeBg" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundColor})` }} onClick={() => close()}>
            <div className={"container" + (transition ? ' active' : '')} style={{ transform: `scale(${scale})` }} onClick={(e) => e.stopPropagation()}>
                <div className='header'>
                    <h1>Joblife - Bienvenue</h1>
                    <div className="closeBtn">
                        <img onClick={() => close()} src="./assets/icones/cross.png" alt="Croix" />
                    </div>
                </div>
                <div className='body'>
                    <div>
                        <p>
                            Merci d'avoir téléchargé l'extension Joblife ! <br></br><br></br>
                            Si vous voulez en profiter pleinement, n'hésitez pas à régler les paramètres
                            selon vos préférences depuis l'engrenage en haut à droite. <br></br><br></br>
                            Notez que cette extension n'est pas officielle et qu'elle n'est pas affiliée à Joblife !
                            Si vous souhaitez faire parvenir des idées d'améliorations ou d'ajouts, ou que vous
                            rencontrez le moindre problème, vous pouvez me contacter sur Twitter/X !
                        </p>
                        <a href={"https://www.x.com/tsuyobnha"} style={{ textDecoration: "none" }} target='_blank'>
                            <p style={{ color: "#1da1f2" }}>@tsuyobnha</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;