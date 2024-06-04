import React, { useState } from 'react';
import Popup from '../components/Popup';
import '../styles/popups/BugsAlert.scss';

const BugsAlert = ({ setBugsAlertOpen }) => {
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(false);

    return <Popup
        header="Signaler un bug, un problème ou demander un ajout"
        setOpen={setBugsAlertOpen}
        body={
            <div className='bugsAlert'>
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
        }
    />
};

export default BugsAlert;