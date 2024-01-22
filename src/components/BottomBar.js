import React, { useEffect, useState } from 'react';

const BottomBar = () => {

    const [socials, setSocials] = useState([])
    useEffect(() => {
        chrome.storage.local.get('JOBLIFE_SOCIALS', (result) => {
            if (result.JOBLIFE_SOCIALS !== undefined) {
                setSocials(result.JOBLIFE_SOCIALS);
            }
        });
    }, []);

    return (
        <div>
            <span className="spacer-up"></span>
            <div className="bottom-bar">
                <a href={socials.twitter} target="_blank" className='image-container twitter'>
                    <img src="./assets/icones/twitter-white.png" alt="Logo Twitter" />
                </a>
                <a href={socials.youtube} target="_blank" className='image-container youtube'>
                    <img src="./assets/icones/youtube-white.png" alt="Logo Youtube" />
                </a>
                <a href={socials.instagram} target="_blank" className='image-container instagram'>
                    <img src="./assets/icones/instagram-white.png" alt="Logo Instagram" />
                </a>
                <a href={socials.tiktok} target="_blank" className='image-container tiktok'>
                    <img src="./assets/icones/tiktok-white.png" alt="Logo Tiktok" />
                </a>
                <span className="spacer"></span>
                <a href={socials.website} target="_blank" className='website'>
                    <img src="./assets/icones/joblife-white.png" alt="Logo Joblife" />
                </a>
            </div>
        </div>
    );
};

export default BottomBar;