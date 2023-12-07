import React, { useEffect, useState } from 'react';
import Video from '../components/Video';

import moment from 'moment';

const Youtube = () => {

    const [videoData, setVideoData] = useState([])
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        chrome.storage.local.get('JOBLIFE_YOUTUBE_VIDEOS', (result) => {
            if (result.JOBLIFE_YOUTUBE_VIDEOS !== undefined) {
                setVideoData(result.JOBLIFE_YOUTUBE_VIDEOS);
                setTimeout(() => setFadeIn(true), 50);
            }
        });
    }, []);

    if (videoData.length === 0) return;
    const videos = videoData.sort((a, b) => {
        const dateA = moment.utc(a.published_at).locale('fr');
        const dateB = moment.utc(b.published_at).locale('fr');

        return dateA.isAfter(dateB) ? -1 : dateA.isBefore(dateB) ? 1 : 0;
    });

    return (
        <div >
            <div className={`fade-in${fadeIn ? ' active' : ''}`}>
                <div className='videos'>
                    <h1>Dernières vidéos</h1>
                    <div className='video-row'>
                        {videos
                            .map((video) => (
                                <li key={video.id}>
                                    <Video video={video} className="v" />
                                </li>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Youtube;