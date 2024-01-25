import React, { useState, useEffect } from 'react';
import Player from './Player';

const Team = ({ setRosterOpen, roster }) => {
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
            setRosterOpen(false);
        }, 300);
    }

    return (
        <div className="rosterBg" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundColor})` }} onClick={() => close()}>
            <div className={"rosterContainer" + (transition ? ' active' : '')} style={{ transform: `scale(${scale})` }} onClick={(e) => e.stopPropagation()}>
                <div className='header'>
                    <h1>{roster.name.toUpperCase()}</h1>
                    <div className="closeBtn">
                        <img onClick={() => close()} src="./assets/icones/cross.png" alt="Croix" />
                    </div>
                </div>
                <div className='body'>
                    <div className='players'>
                        {Object.values(roster.players)
                            .sort((a, b) => a.index - b.index)
                            .map((player) => (
                                <Player key={player.nickname} player={player} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;