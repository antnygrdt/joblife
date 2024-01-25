import React, { useState } from 'react';
import Image from './Image';

const Player = ({ player }) => {
    const [imageOpen, setImageOpen] = useState(false);

    return (
        <div>
            <li key={player.nickname}>
                {imageOpen && <Image setImageOpen={setImageOpen} player={player} />}
                <div className='player'>
                    <img src={player.avatar} alt={player.nickname} className='icone' onClick={() => setImageOpen(true)} />
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
        </div>
    );
};

export default Player;