import React, { useState } from 'react';
import moment from 'moment';
import Team from './Team';

const Roster = ({ roster }) => {
    const date = moment.utc(roster.start_date).locale('fr').format('DD/MM/YYYY');
    const [rosterOpen, setRosterOpen] = useState(false);

    return (
        <div>
            {rosterOpen && <Team setRosterOpen={setRosterOpen} roster={roster} />}
            <div className='roster-card' onClick={() => setRosterOpen(true)}>
                <div className='roster'>
                    <img src={roster.avatar} className='icone' />
                    <div className='infos'>
                        <p className='name'>{roster.name}</p>
                        <p className='date'>{'À débuté le: ' + date}</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Roster;