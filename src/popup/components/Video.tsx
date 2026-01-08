import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Video as VideoType } from '../interfaces';

const Video = ({ video, className, isBig = false }: { video: VideoType; className?: string; isBig?: boolean }) => {
  const [isLoaded, setLoaded] = useState(false);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      const truncatedText = text.slice(0, maxLength);
      const lastSpaceIndex = truncatedText.lastIndexOf(' ');
      if (lastSpaceIndex !== -1) {
        return truncatedText.slice(0, lastSpaceIndex) + '...';
      }
      return truncatedText + '...';
    }
    return text;
  };

  const title = truncateText(video.title, isBig ? 80 : 50);

  return (
    <a href={"https://youtu.be/" + video.id} target='_blank' rel="noreferrer">
      <div className={`video ${isBig ? 'video-big' : 'video-small'}`}>
        <LazyLoadImage
          src={video.thumbnail}
          loading='lazy'
          effect='blur'
          onLoad={() => setLoaded(true)}
        />
        {isLoaded && <p>{title}</p>}
      </div>
    </a>
  );
};

export default Video;
