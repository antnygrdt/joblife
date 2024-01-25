import React, { useEffect, useState } from 'react';
import Video from '../components/Video';

import moment from 'moment';

const Youtube = () => {

    const maxVideos = 20;
    const [isUnrolled, setIsUnrolled] = useState(false);
    const [videos, setVideos] = useState([]);
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        chrome.storage.local.get('JOBLIFE_YOUTUBE_VIDEOS', (result) => {
            if (result.JOBLIFE_YOUTUBE_VIDEOS !== undefined) {
                setTimeout(() => setFadeIn(true), 50);
                const vids = result.JOBLIFE_YOUTUBE_VIDEOS.sort((a, b) => {
                    const dateA = moment.utc(a.published_at).locale('fr');
                    const dateB = moment.utc(b.published_at).locale('fr');

                    return dateA.isAfter(dateB) ? -1 : dateA.isBefore(dateB) ? 1 : 0;
                });

                setVideos(vids);
            }
        });
    }, []);

    const videoList = isUnrolled ? videos : videos.slice(0, maxVideos);

    return (
        <div >
            <div className={`fade-in${fadeIn ? ' active' : ''}`}>
                <div className='videos'>
                    <h1>DERNIÈRES VIDÉOS</h1>
                    <div className='video-row'>
                        {videoList
                            .map((video) => (
                                <li key={video.id}>
                                    <Video video={video} className="v" />
                                </li>
                            ))
                        }
                        {!isUnrolled &&
                            <button onClick={() => setIsUnrolled(true)}>Afficher toutes les vidéos</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Youtube;