import React from 'react';
import moment from 'moment';

const Streamer = ({ streamer }) => {
    const date = moment.utc(streamer.started_at).locale('fr').format('DD/MM/YYYY');

    return (
        <div>
            <a href={"https://www.twitch.tv/" + streamer.username} target='_blank' className='streamer-link'>
                <div className={'streamer ' + (streamer.isStreaming ? "online" : "offline")}>
                    <img src={streamer.avatar} alt={"Logo Twitch " + streamer.name} className='icone' />
                    <div className='infos1'>
                        <p className='name'>{streamer.name}</p>
                        <p className='title-date'>{streamer.isStreaming ? streamer.title : date}</p>
                    </div>
                    <div className='infos2'>
                        <div className='viewer-count'>
                            {streamer.isStreaming && (
                                <img src="./assets/icones/utilisateur.png" alt="icone humain" />
                            )}
                            <p>{streamer.isStreaming ? streamer.viewer_count : "Hors ligne"}</p>
                        </div>
                        <p >{streamer.game}</p>
                    </div>
                </div>
            </a>
        </div>

    );
};

export default Streamer;