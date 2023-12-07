import React, { useEffect, useState } from 'react';
import Roster from '../components/Roster';
import moment from 'moment';

const Rosters = () => {

    const [rosterData, setRosterData] = useState({});
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        chrome.storage.local.get('JOBLIFE_ROSTERS', (result) => {
            if (result.JOBLIFE_ROSTERS !== undefined) {
                setRosterData(result.JOBLIFE_ROSTERS);
                setTimeout(() => setFadeIn(true), 50);
            }
        });
    }, [])

    const rosters = Object.values(rosterData).sort((a, b) => {
        const aStartedAt = moment.utc(a.start_date).locale('fr');
        const bStartedAt = moment.utc(b.start_date).locale('fr');
        return bStartedAt - aStartedAt;
    });

    return (
        <div>
            <div className={`fade-in${fadeIn ? ' active' : ''}`}>
                <div className='roster-page'>
                    <div className='roster-list'>
                        {Object.values(rosters)
                            .map((roster) => (
                                <div key={roster.name}>
                                    <Roster roster={roster} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rosters;