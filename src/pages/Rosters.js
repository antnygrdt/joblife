import React, { useEffect, useState } from 'react';
import moment from 'moment';

import Roster from '../popups/Roster';

const Rosters = () => {

  const [rosterData, setRosterData] = useState({});
  const [rosterOpen, setRosterOpen] = useState(false);
  const [openedRoster, setOpenedRoster] = useState(null);
  const [members, setMembers] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['JOBLIFE_ROSTERS', 'JOBLIFE_MEMBERS'], (result) => {
      if (result.JOBLIFE_ROSTERS !== undefined) {
        setRosterData(result.JOBLIFE_ROSTERS);
        setTimeout(() => setFadeIn(true), 50);
      }

      if (result.JOBLIFE_MEMBERS !== undefined) {
        setMembers(result.JOBLIFE_MEMBERS);
      }
    });
  }, [])

  return (
    <div>
      <div className={`fade-in${fadeIn ? ' active' : ''}`}>
        <div className='roster-list scroll-bar'>
          {rosterOpen && <Roster roster={openedRoster} members={members} setOpen={setRosterOpen} />}
          {Object.values(rosterData)
            .map((roster) => (
              <div key={roster.name}>
                <div className='roster-card' onClick={() => {
                  setOpenedRoster(roster);
                  setRosterOpen(true);
                }}>
                  <img src={roster.avatar} className='icone' />
                  <div className='infos'>
                    <p className='name'>{roster.name}</p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Rosters;