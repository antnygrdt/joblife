import React, { useState, useEffect } from 'react';
import BugsAlert from './BugsAlert';
import Popup from '../components/Popup';
import '../styles/popups/Settings.scss';

const Settings = ({ setOpenSettings }) => {

    const [settings, setSettings] = useState({});
    const [bugsAlertOpen, setBugsAlertOpen] = useState(false);
    const [coffeeOpen, setCoffeeOpen] = useState(false);

    useEffect(() => {
        chrome.storage.local.get('JOBLIFE_PARAMETERS', (result) => {
            if (result.JOBLIFE_PARAMETERS !== undefined) {
                const jp = result.JOBLIFE_PARAMETERS;
                setSettings(jp);
            }
        });
    }, []);

    function checkBox(name, data) {
        const checked = settings[data] === undefined ? true : settings[data];
        return (
            <div className='parameter'>
                <p>{name}</p>
                <input type="checkbox" id={data} checked={checked} onChange={(e) => onChange(data, e.target.checked)}></input>
            </div>
        )
    }

    function defaultPage() {
        const choice = settings['DEFAULT_PAGE'] === undefined ? 'calendar' : settings['DEFAULT_PAGE'];
        return (
            <div className='parameter'>
                <p>Page par défaut</p>
                <select id="choices" value={choice} onChange={(e) => onChange('DEFAULT_PAGE', e.target.value)}>
                    <option value="twitch">Live</option>
                    <option value="calendar">Calendrier</option>
                    <option value="youtube">YouTube</option>
                    <option value="rosters">Rosters</option>
                </select>
            </div>
        )
    }

    function onChange(data, b) {
        const newData = { ...settings };
        newData[data] = b;

        setSettings(newData);

        chrome.storage.local.set({
            JOBLIFE_PARAMETERS: newData
        });
    }

    return (
        <div>
            <Popup
                header="Paramètres"
                setOpen={setOpenSettings}
                containerStyle={{ paddingBottom: '15px', width: '400px' }}
                body={
                    <div style={{ textAlign: 'start', padding: '0' }} className='settings'>
                        {Object.keys(settings).length === 0 ?

                            <div>
                                <h1>Loading...</h1>
                            </div> :

                            <div>
                                <div className='category'>
                                    <h2>Général</h2>
                                    {defaultPage()}
                                </div>

                                <div className='category'>
                                    <h2>Notifications</h2>
                                    {checkBox("Twitch", "LIVE")}
                                    {checkBox("Youtube", "VIDEO")}
                                    {checkBox("Début de match", "MATCH_START")}
                                    {checkBox("Fin de match", "MATCH_END")}
                                    {checkBox("Fin de game (BO)", "GAME_END")}
                                    <br></br>
                                    {checkBox("Personnalisée", "CUSTOM")}
                                    <br></br>
                                </div>

                                <div className='contact'>
                                    <div>
                                        <h3>Me contacter</h3>
                                        <a href={"https://www.x.com/tsuyobnha"} target='_blank'>
                                            <p>@tsuyobnha</p>
                                        </a>
                                    </div>
                                    <img className="bugs" src="assets/icones/bugs.png" alt="signaler" title='Signaler un bug, un problème ou demander un ajout' onClick={() => setBugsAlertOpen(true)} />
                                </div>
                                <div className={'coffee' + (coffeeOpen ? ' opened' : '')} >
                                    <div className='button' onClick={() => setCoffeeOpen(!coffeeOpen)}>
                                        <i className={'arrow ' + (coffeeOpen ? 'down' : 'up')}></i>
                                    </div>
                                    <div className='content'>
                                        <p>Je travaille seul sur l'extension, si vous aimez mon travail et que vous souhaitez me soutenir,
                                            vous pouvez me payer un café ☕️
                                        </p>
                                        <a href="https://ko-fi.com/tsuyobnha" target='_blank'>
                                            <button>☕️ Me soutenir</button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                }
            />
            {bugsAlertOpen && <BugsAlert setBugsAlertOpen={setBugsAlertOpen} />}
        </div>
    )
};

export default Settings;