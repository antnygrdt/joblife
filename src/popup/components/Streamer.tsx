import moment from 'moment-timezone';
import 'moment/dist/locale/fr';
import { Streamer as StreamerType } from '../interfaces';

moment.locale('fr');

const Streamer = ({ streamer }: { streamer: StreamerType }) => {
  const date = streamer.started_at ? moment.tz(streamer.started_at, moment.tz.guess()).locale('fr').format('DD/MM/YYYY') : "-";

  return (
    <div>
      <a href={"https://www.twitch.tv/" + streamer.username} target='_blank' className='streamer-link'>
        <div className={'streamer ' + (streamer.isStreaming ? "online" : "offline")}>
          <img src={streamer.avatar} alt={"Logo Twitch " + streamer.name} className='icone' />
          <div className='infos1'>
            <p className='name'>{streamer.name}</p>
            <p className='title-date'>{streamer.isStreaming ? streamer.title : date}</p>
          </div>
          <div className='infos2'>
            <div className='viewer-count'>
              {streamer.isStreaming && (
                <img src="/assets/icones/user.png" alt="user" />
              )}
              <p>{streamer.isStreaming ? streamer.viewer_count : "Hors ligne"}</p>
            </div>
            <p >{streamer.game}</p>
          </div>
        </div>
      </a>
    </div>
  );
};

export default Streamer;