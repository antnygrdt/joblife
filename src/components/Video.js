import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Video = ({ video }) => {

    const [isLoaded, setLoaded] = useState(false);

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            const truncatedText = text.substr(0, maxLength);
            const lastSpaceIndex = truncatedText.lastIndexOf(' ');
            if (lastSpaceIndex !== -1) {
                return truncatedText.substr(0, lastSpaceIndex) + '...';
            }
            return truncatedText + '...';
        }
        return text;
    };

    const title = truncateText(video.title, 50);

    return (
        <a href={"https://youtu.be/" + video.id} target='_blank'>
            <div className='video'>
                <LazyLoadImage
                    src={video.thumbnail}
                    loading='lazy'
                    effect='blur'
                    height='100px'
                    onLoad={() => setLoaded(true)}
                />
                {isLoaded && <p>{title}</p>}
            </div>
        </a>
    );
};

export default Video;