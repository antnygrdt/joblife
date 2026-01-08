import React, { useEffect, useState } from 'react';
import { Roster, Member } from '../interfaces';
import RosterComponent from '../popups/Roster';

const Rosters = () => {
  const [rosterData, setRosterData] = useState<{ [key: string]: Roster }>({});
  const [rosterOpen, setRosterOpen] = useState(false);
  const [openedRoster, setOpenedRoster] = useState<Roster | null>(null);
  const [members, setMembers] = useState<{ [key: string]: Member }>({});
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['JOBLIFE_ROSTERS', 'JOBLIFE_MEMBERS'], (result) => {
      if (result.JOBLIFE_ROSTERS !== undefined && result.JOBLIFE_ROSTERS !== null) {
        setRosterData(result.JOBLIFE_ROSTERS as { [key: string]: Roster });
        setTimeout(() => setFadeIn(true), 50);
      }

      if (result.JOBLIFE_MEMBERS !== undefined && result.JOBLIFE_MEMBERS !== null) {
        setMembers(result.JOBLIFE_MEMBERS as { [key: string]: Member });
      }
    });
  }, [])

  return (
    <div>
      <div className={`fade-in${fadeIn ? ' active' : ''}`}>
        <div className='roster-list scroll-bar'>
          {rosterOpen && openedRoster && <RosterComponent roster={openedRoster} members={members} setOpen={setRosterOpen} />}
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
