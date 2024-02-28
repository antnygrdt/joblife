import React, { useState, useEffect } from 'react';

const BugsAlert = ({ setBugsAlertOpen }) => {
    const [transition, setTransition] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(0.750);
    const [scale, setScale] = useState(0);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
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
            setBugsAlertOpen(false);
        }, 300);
    }

    return (
        <div className="bugsAlertBg" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundColor})` }} onClick={() => close()}>
            <div className={"bugsAlertContainer" + (transition ? ' active' : '')} style={{ transform: `scale(${scale})` }} onClick={(e) => e.stopPropagation()}>
                <div className='header'>
                    <h1>Signaler un bug, un problème ou demander un ajout</h1>
                    <div className="closeBtn">
                        <img onClick={() => close()} src="./assets/icones/cross.png" alt="Croix" />
                    </div>
                </div>
                <div className='body'>
                    {sent ?
                        <div>
                            {(error ? <p>Une erreur est survenue lors de l'envoi du message...</p> : <p>Message envoyé avec succès !</p>)}
                            <button onClick={() => close()}>Fermer</button>
                        </div>
                        :
                        <form onSubmit={(event) => {
                            event.preventDefault();
                            const type = event.target.elements[0].value;
                            const pseudo = event.target.elements[1].value;
                            const message = event.target.elements[2].value;

                            const data = { type, pseudo, message };

                            fetch('https://api.asakicorp.com/joblife/bugs', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data),
                            }).then(response => {
                                if (!response.ok) {
                                    setError(true);
                                }

                                setSent(true);
                            }).catch(() => {
                                setError(true);
                            });
                        }}>
                            <label>
                                Type: <span className="required">*</span>
                                <select defaultValue="" required>
                                    <option value="" disabled>Sélectionnez une option</option>
                                    <option value="bug">Bug</option>
                                    <option value="problem">Problème</option>
                                    <option value="add">Ajout</option>
                                </select>
                            </label>
                            <br />
                            <label>
                                Pseudo:
                                <input type="text" name="pseudo" />
                            </label>
                            <br />
                            <label>
                                Message: <span className="required">*</span>
                                <textarea name="message" required></textarea>
                            </label>
                            <br />
                            <input type="submit" value="Envoyer" />
                        </form>
                    }
                </div>
            </div>
        </div>
    );
};

export default BugsAlert;