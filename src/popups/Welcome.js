import React from 'react';
import Popup from '../components/Popup';

const Welcome = ({ setOpenWelcome }) => {

    return (
        <Popup
            header="Joblife - Bienvenue"
            setOpen={setOpenWelcome}
            body={
                <div>
                    <p style={{ margin: "10px 0px" }}>
                        Merci d'avoir téléchargé l'extension Joblife ! <br></br><br></br>
                        Si vous voulez en profiter pleinement, n'hésitez pas à régler les paramètres
                        selon vos préférences depuis l'engrenage en haut à droite. <br></br><br></br>
                        Notez que cette extension n'est pas officielle et qu'elle n'est pas affiliée à Joblife !
                        Si vous souhaitez faire parvenir des idées d'améliorations ou d'ajouts, ou que vous
                        rencontrez le moindre problème, vous pouvez me contacter sur Twitter/X !
                    </p>
                    <a href={"https://www.x.com/tsuyobnha"} style={{ textDecoration: "none" }} target='_blank'>
                        <p style={{ color: "#1da1f2" }}>@tsuyobnha</p>
                    </a>
                </div>
            }
        />
    );
};

export default Welcome;