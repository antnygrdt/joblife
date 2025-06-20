import React, { useState, useEffect } from 'react';
import Popup from '../components/Popup';
import "../styles/popups/Update.scss";

const Update = ({ setUpdateOpen, updates }) => {

  const [update, setUpdate] = useState(null);

  useEffect(() => {
    const currentVersion = chrome.runtime.getManifest().version;
    let hasUpdate = false;
    if (updates[currentVersion] !== undefined) {
      hasUpdate = true;
      setUpdate(updates[currentVersion]);
    }

    if (!hasUpdate) {
      setUpdateOpen(false);
    }
  }, []);

  if (update === null) return <div></div>;

  return (
    <Popup
      header="Joblife - Mise à jour"
      setOpen={setUpdateOpen}
      body={
        <div className='update-popup scroll-bar'>
          <p>Une nouvelle mise à jour à été installée !</p>
          <div style={{ marginTop: '18px' }}>
            <div className='updates'>
              <p style={{ textDecoration: 'underline', marginBottom: '4px' }}>Voici les nouveautés :</p>
              {update.split('\\n').map((line, index) => {
                return <p key={index} style={{ marginBottom: '2px' }}>{line === '' ? '\u00A0' : line}</p>;
              })}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Update;