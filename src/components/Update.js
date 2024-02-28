import React, { useState, useEffect } from 'react';

const Update = ({ setUpdateOpen }) => {

    const [transition, setTransition] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(0.750);
    const [scale, setScale] = useState(1);
    const [update, setUpdate] = useState(null);

    const close = () => {
        setTransition(true);
        setBackgroundColor(0);
        setScale(0);
        setTimeout(() => {
            setUpdateOpen(false);
        }, 300);
    }

    useEffect(() => {
        fetch('https://api.asakicorp.com/joblife/updates')
            .then(response => response.json())
            .then(data => {
                const currentVersion = chrome.runtime.getManifest().version;
                if (data[currentVersion] !== undefined) {
                    setUpdate(data[currentVersion]);
                }
            });
    }, []);

    return (
        <div className="updateBg" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundColor})` }} onClick={() => close()}>
            <div className={"container" + (transition ? ' active' : '')} style={{ transform: `scale(${scale})` }} onClick={(e) => e.stopPropagation()}>
                <div className='header'>
                    <h1>Joblife - Mise à jour</h1>
                    <div className="closeBtn">
                        <img onClick={() => close()} src="./assets/icones/cross.png" alt="Croix" />
                    </div>
                </div>
                <div className='body'>
                    <div>
                        <p>Une nouvelle mise à jour à été installée !</p>
                        {update !== null &&
                            <div style={{ marginTop: '18px' }}>
                                <p style={{ textDecoration: 'underline', marginBottom: '4px' }}>Voici les nouveautés :</p>
                                {update.split('\\n').map((line, index) => {
                                    return <p key={index} style={{ marginBottom: '2px' }}>{line === '' ? '\u00A0' : line}</p>;
                                })}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Update;