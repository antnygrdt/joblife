import moment from 'moment';
import React, { useEffect, useState } from 'react';

import Streamer from '../components/Streamer';

const Twitch = () => {

  const [streamerData, setStreamerData] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('JOBLIFE_STREAMERS', (result) => {
      if (result.JOBLIFE_STREAMERS !== undefined) {
        setStreamerData(result.JOBLIFE_STREAMERS);
        setTimeout(() => setFadeIn(true), 50);
      }
    });
  }, [])

  if (streamerData.length === 0) return;
  const streamers = streamerData.sort((a, b) => {
    if (!a.started_at && b.started_at) return 1;
    if (a.started_at && !b.started_at) return -1;
    if (!a.started_at && !b.started_at) return 0;

    const aStartedAt = moment.utc(a.started_at).locale('fr');
    const bStartedAt = moment.utc(b.started_at).locale('fr');

    return bStartedAt - aStartedAt;
  });

  const online = streamers.filter((streamer) => streamer.isStreaming);
  const offline = streamers.filter((streamer) => !streamer.isStreaming);

  return (
    <div>
      <div className={`fade-in${fadeIn ? ' active' : ''}`}>
        <div className='twitch-page'>
          <div className='streamer-list scroll-bar'>
            {online.length > 0 && (
              <h1>{"En ligne (" + online.length + ")"}</h1>
            )}
            {online
              .map((streamer) => (
                <li key={streamer.name}>
                  <Streamer streamer={streamer} />
                </li>
              ))
            }

            {offline.length > 0 && (
              <h1>{"Hors ligne (" + offline.length + ")"}</h1>
            )}
            {offline
              .map((streamer) => (
                <li key={streamer.name}>
                  <Streamer streamer={streamer} />
                </li>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Twitch;