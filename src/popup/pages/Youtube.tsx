import { useEffect, useState, useMemo, useRef } from 'react';
import { Video } from '../interfaces';
import VideoComponent from '../components/Video';
import moment from 'moment';
import 'moment/dist/locale/fr';

moment.locale('fr');

const Youtube = () => {
  const maxVideos = 20;
  const [isUnrolled, setIsUnrolled] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const scrollPositions = useRef<Record<string, number>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chrome.storage.local.get('JOBLIFE_YOUTUBE_VIDEOS', (result) => {
      if (result.JOBLIFE_YOUTUBE_VIDEOS !== undefined) {
        setTimeout(() => setFadeIn(true), 50);
        const vids = (result.JOBLIFE_YOUTUBE_VIDEOS as Video[]).sort((a, b) => {
          const dateA = moment.utc(a.published_at).locale('fr');
          const dateB = moment.utc(b.published_at).locale('fr');

          return dateA.isAfter(dateB) ? -1 : dateA.isBefore(dateB) ? 1 : 0;
        });

        setVideos(vids);
      }
    });
  }, []);

  // Get unique channels
  const channels = useMemo(() => {
    const channelMap = new Map<string, string>();
    videos.forEach(video => {
      if (!channelMap.has(video.channel_id)) {
        channelMap.set(video.channel_id, video.channel_title);
      }
    });
    return Array.from(channelMap.entries())
      .map(([id, title]) => ({ id, title }))
      .sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }));
  }, [videos]);

  // Filter videos by channel
  const filteredVideos = useMemo(() => {
    if (selectedChannel === 'all') {
      return videos;
    }
    return videos.filter(video => video.channel_id === selectedChannel);
  }, [videos, selectedChannel]);

  // Handle channel change - save current scroll position and restore new one
  const handleChannelChange = (channelId: string) => {
    // Save current scroll position
    if (scrollContainerRef.current) {
      scrollPositions.current[selectedChannel] = scrollContainerRef.current.scrollTop;
    }

    // Change channel
    setSelectedChannel(channelId);

    // Restore scroll position for new channel after render
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const savedPosition = scrollPositions.current[channelId] || 0;
        scrollContainerRef.current.scrollTop = savedPosition;
      }
    }, 0);
  };

  const videoList = isUnrolled ? filteredVideos : filteredVideos.slice(0, maxVideos);

  // Group videos in the alternating pattern: [big, small, small, small, small, big, small, small, ...]
  const groupedVideos = useMemo(() => {
    const groups: Array<{ videos: Video[]; isBig: boolean }> = [];
    let index = 0;

    while (index < videoList.length) {
      // One big video
      if (index < videoList.length) {
        groups.push({ videos: [videoList[index]], isBig: true });
        index++;
      }

      // Two rows of two videos (4 videos total, but split into 2 groups of 2)
      if (index < videoList.length) {
        const firstRow = videoList.slice(index, index + 2);
        if (firstRow.length > 0) {
          groups.push({ videos: firstRow, isBig: false });
          index += firstRow.length;
        }
      }

      if (index < videoList.length) {
        const secondRow = videoList.slice(index, index + 2);
        if (secondRow.length > 0) {
          groups.push({ videos: secondRow, isBig: false });
          index += secondRow.length;
        }
      }
    }

    return groups;
  }, [videoList]);

  return (
    <div >
      <div className={`fade-in${fadeIn ? ' active' : ''}`}>
        <div className='videos-page'>
          {channels.length > 0 && (
            <div className='channel-filter'>
              <button
                className={`channel-button ${selectedChannel === 'all' ? 'active' : ''}`}
                onClick={() => handleChannelChange('all')}
              >
                Tous
              </button>
              {channels.map(channel => (
                <button
                  key={channel.id}
                  className={`channel-button ${selectedChannel === channel.id ? 'active' : ''}`}
                  onClick={() => handleChannelChange(channel.id)}
                >
                  {channel.title}
                </button>
              ))}
            </div>
          )}
          <div className='videos'>
            <div ref={scrollContainerRef} className='video-container scroll-bar'>
              {groupedVideos.map((group, groupIndex) => (
                <div key={groupIndex} className={group.isBig ? 'video-row-big' : 'video-row-small'}>
                  {group.videos.map((video) => (
                    <VideoComponent
                      key={video.id}
                      video={video}
                      isBig={group.isBig}
                    />
                  ))}
                </div>
              ))}

              {!isUnrolled && filteredVideos.length > maxVideos && (
                <button style={{ marginBottom: '2px' }} className="show-more-button" onClick={() => setIsUnrolled(true)}>Afficher toutes les vidéos</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Youtube;
