import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const UpperBar = ({ setSettingsOpen, setNotesOpen, setEasterEggOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [easter, setEaster] = useState(0);

    useEffect(() => {
        chrome.storage.local.get('JOBLIFE_PARAMETERS', (result) => {
            if (result.JOBLIFE_PARAMETERS !== undefined) {
                const page = result.JOBLIFE_PARAMETERS.DEFAULT_PAGE;
                if (page !== undefined) {
                    navigate('/' + (page === 'calendar' ? '' : page));
                }
            }
        });
    }, [])

    function easterEgg() {
        const current = easter + 1;
        setEaster(current);

        if (current === 5) {
            setEaster(0);
            setEasterEggOpen(true);
        }
    }

    return (
        <div>
            <div className='upper-bar'>
                <div className='logo'>
                    <img src="./assets/Joblife-Logo.png" alt="Logo Joblife" onClick={() => easterEgg()} />
                </div>
                <div className='right' >
                    <img src="./assets/icones/notes.png" alt="Notes" title='Notes' onClick={() => setNotesOpen(true)} />
                    <img className='settings' src="./assets/icones/settings.png" alt="Settings" title='Paramètres' onClick={() => setSettingsOpen(true)} />
                </div>
            </div>
            <div className="navigation">
                <ul>
                    <li className={location.pathname === '/twitch' ? 'selected' : ''}>
                        <NavLink className="link" to="/twitch">
                            <img src="./assets/icones/1.png" alt="logo twitch" />
                            <p>Live</p>
                        </NavLink>
                    </li>
                    <li className={location.pathname === '/' || location.pathname === "/popup.html" ? 'selected' : ''}>
                        <NavLink className="link" to="/">
                            <img src="./assets/icones/2.png" alt="calendrier" />
                            <p>Calendrier</p>
                        </NavLink>
                    </li>
                    <li className={location.pathname === '/youtube' ? 'selected' : ''}>
                        <NavLink className="link" to="/youtube">
                            <img src="./assets/icones/3.png" alt="logo youtube" />
                            <p>YouTube</p>
                        </NavLink>
                    </li>
                    <li className={location.pathname === '/rosters' ? 'selected' : ''}>
                        <NavLink className="link" to="/rosters">
                            <img src="./assets/icones/4.png" alt="rosters" />
                            <p>Rosters</p>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UpperBar;