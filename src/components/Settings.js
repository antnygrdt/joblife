import React, { useState, useEffect } from 'react';
import BugsAlert from './BugsAlert';

const Settings = ({ setOpenSettings }) => {

    const [settings, setSettings] = useState({});

    const [transition, setTransition] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(0.750);
    const [scale, setScale] = useState(0);

    const [bugsAlertOpen, setBugsAlertOpen] = useState(false);

    const [coffeeOpen, setCoffeeOpen] = useState(false);

    useEffect(() => {
        chrome.storage.local.get('JOBLIFE_PARAMETERS', (result) => {
            if (result.JOBLIFE_PARAMETERS !== undefined) {
                const jp = result.JOBLIFE_PARAMETERS;
                setSettings(jp);
            }
        });

        show();
    }, []);

    const show = () => {
        setTransition(true);
        setScale(1);
        setTimeout(() => {
            setTransition(false);
        }, 300);
    };

    const close = () => {
        setTransition(true);
        setBackgroundColor(0);
        setScale(0);
        setTimeout(() => {
            setOpenSettings(false);
        }, 300);
    }

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
            {bugsAlertOpen && <BugsAlert setBugsAlertOpen={setBugsAlertOpen} />}
            <div className="settingsBg" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundColor})` }} onClick={() => close()}>
                <div className={"settingsContainer" + (transition ? ' active' : '')} style={{ transform: `scale(${scale})` }} onClick={(e) => e.stopPropagation()}>
                    <div className='header'>
                        <h1>Paramètres</h1>
                        <div className="closeBtn">
                            <img onClick={() => close()} src="./assets/icones/cross.png" alt="Croix" />
                        </div>
                    </div>
                    <div className='body'>
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
                                        <a href="https://www.buymeacoffee.com/tsuyo" target='_blank'>
                                            <button>☕️ Me soutenir</button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;