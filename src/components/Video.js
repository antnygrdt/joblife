import React from 'react';

const Video = ({ video }) => {

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
                <img src={video.thumbnail} alt={"Thumbnail"} loading="lazy" />
                <p>{title}</p>
            </div>
        </a>
    );
};

export default Video;