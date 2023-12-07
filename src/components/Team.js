import React, { useState, useEffect } from 'react';

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
                                <li key={player.nickname}>
                                    <div className='player'>
                                        <img src={player.avatar} alt={player.nickname} className='icone' />
                                        <div className='infos1'>
                                            <p className='nickname'>{player.nickname}</p>
                                            <p className='name'>{player.name}</p>
                                            <p className='role'>{player.role}</p>
                                        </div>
                                        <div className='infos2'>
                                            {player.twitch &&
                                                <a href={'https://twitch.tv/' + player.twitch} target='_blank'>
                                                    <img src="./assets/icones/1.png" alt="" />
                                                </a>
                                            }
                                            <a href={'https://x.com/' + player.twitter} target='_blank'>
                                                <img src="./assets/icones/x.png" alt="" />
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;