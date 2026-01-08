import React, { useEffect, useState } from 'react';
import { Socials } from '../interfaces';

const BottomBar = () => {
  const [socials, setSocials] = useState<Socials>({});

  useEffect(() => {
    chrome.storage.local.get('JOBLIFE_SOCIALS', (result) => {
      if (result.JOBLIFE_SOCIALS !== undefined && result.JOBLIFE_SOCIALS !== null) {
        setSocials(result.JOBLIFE_SOCIALS as Socials);
      }
    });
  }, []);

  return (
    <div>
      <div className="bottom-bar">
        <div className='left'>
          <a href={socials.twitter} target="_blank">
            <img src="/assets/icones/socials/x.png" alt="Logo Twitter" />
          </a>
          <a href={socials.youtube} target="_blank">
            <img src="/assets/icones/socials/youtube-white.png" alt="Logo Youtube" />
          </a>
          <a href={socials.instagram} target="_blank">
            <img src="/assets/icones/socials/instagram-white.png" alt="Logo Instagram" />
          </a>
          <a href={socials.tiktok} target="_blank">
            <img src="/assets/icones/socials/tiktok-white.png" alt="Logo Tiktok" />
          </a>
        </div>
        <span className="spacer"></span>
        <div className='right'>
          <a href={socials.website} target="_blank">
            <img src="/assets/icones/joblife-website.png" alt="Logo Joblife" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;