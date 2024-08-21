import moment from 'moment';
import React, { useState } from 'react';
import Popup from '../components/Popup';
import '../styles/popups/Notes.scss';
import { compareVersions, parseTextWithUrls } from '../Utils';

const Notes = ({ setOpen, updates, notifications }) => {

  const [page, setPage] = useState('notifications');

  if (updates === null || notifications === null) return (<div></div>);

  return (
    <div className='notes'>
      <Popup
        header={
          <div className='heading'>
            <button className={page === 'notifications' ? 'selected' : ''} onClick={() => setPage('notifications')}>
              <img style={{ width: '18px' }} src="assets/icones/notification.png" />
              Notifications
            </button>
            <button className={page === 'patchs' ? 'selected' : ''} onClick={() => setPage('patchs')}>
              <img style={{ width: '16px' }} src="assets/icones/update.png" />
              Patchs
            </button>
          </div>
        }
        setOpen={setOpen}
        body={page === 'patchs' ?
          Object.values(updates).length === 0 ? <p>Aucune mise à jour disponible.</p> :
            <div className='entries scroll-bar'>
              {Object.entries(updates)
                .sort(([keyA], [keyB]) => compareVersions(keyB, keyA))
                .map(([key, value], index) => (
                  <div key={key}>
                    <div className='update'>
                      <h3>{key}</h3>
                      {value.split('\\n').map((line, index) => (
                        <p key={index} style={{ marginBottom: '2px' }}>{line === '' ? '\u00A0' : line}</p>
                      ))}
                    </div>
                    {index + 1 !== Object.values(updates).length && <h2 className='spacer'></h2>}
                  </div>
                ))}
            </div> :
          notifications.length === 0 ? <p>Aucune notification disponible.</p> :
            <div className='entries'>
              {notifications
                .sort((a, b) => new Date(b[1].start) - new Date(a[1].start))
                .map(([key, value], index) => (
                  <div key={key}>
                    <div className='notification'>
                      <h3>{value.title}</h3>
                      {parseTextWithUrls(value.message)}
                      <p className='date'>{moment.utc(value.start).locale('fr').format('[Le] DD/MM/YYYY [à] HH[h]mm')}</p>
                    </div>
                    {index + 1 !== notifications.length && <h2 className='spacer'></h2>}
                  </div>
                ))}
            </div>
        }
      />
    </div>
  )
};

export default Notes;