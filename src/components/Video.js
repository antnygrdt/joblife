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
        <div className='video'>
            <a href={"https://youtu.be/" + video.id} target='_blank'>
                <img src={video.thumbnail} alt={"Miniature Joblife Esport"} loading="lazy" />
                <p className="title">{title}</p>
            </a>
        </div>
    );
};

export default Video;