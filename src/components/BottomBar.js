import React from 'react';

const BottomBar = () => {

    return (
        <div>
            <span className="spacer-up"></span>
            <div className="bottom-bar">
                <a href="https://twitter.com/JoblifeEsport" target="_blank" className='image-container twitter'>
                    <img src="./assets/icones/twitter-white.png" alt="Logo Twitter" />
                </a>
                <a href="https://www.youtube.com/@joblifeesport" target="_blank" className='image-container youtube'>
                    <img src="./assets/icones/youtube-white.png" alt="Logo Youtube" />
                </a>
                <a href="https://www.instagram.com/joblifeesport/" target="_blank" className='image-container instagram'>
                    <img src="./assets/icones/instagram-white.png" alt="Logo Instagram" />
                </a>
                <a href="https://www.tiktok.com/@joblifeesport" target="_blank" className='image-container tiktok'>
                    <img src="./assets/icones/tiktok-white.png" alt="Logo Tiktok" />
                </a>
                <span className="spacer"></span>
                <a href="https://shop.joblife.fr/" target="_blank" className='website'>
                    <img src="./assets/icones/joblife-white.png" alt="Logo Joblife" />
                </a>
            </div>
        </div>
    );
};

export default BottomBar;