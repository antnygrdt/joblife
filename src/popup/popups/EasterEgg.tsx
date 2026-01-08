import { useEffect } from 'react';
import Popup from '../components/Popup';

const EasterEgg = ({ setEasterEggOpen }: { setEasterEggOpen: (open: boolean) => void }) => {
  useEffect(() => {
    var audio = new Audio('/assets/sounds/easter_egg.mp3');
    audio.volume = 0.05;
    audio.play();

    fetch('https://api-joblife.tsuyo.fr/joblife/bugs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: "easter_egg",
        message: "Un utilisateur a trouvé l'easter egg",
      }),
    });
  }, []);

  return (
    <Popup
      header={"Tu as trouvé un Easter Egg !"}
      setOpen={setEasterEggOpen}
      headerStyle={{
        background: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet, red)",
        backgroundSize: "1400% 100%",
        animation: "easterEgg_Background 10s linear infinite"
      }}
      containerStyle={{
        background: "linear-gradient(to right, black, white, black)",
        backgroundSize: "1400% 100%",
        animation: "easterEgg_Background 10s linear infinite"
      }}
      body={
        <div style={{ margin: "10px 0px" }}>
          <p style={{ color: 'white', marginBottom: "10px", animation: "easterEgg_Text 10s linear infinite" }}>
            Bien joué, tu as trouvé l'easter egg !<br></br><br></br>
            Ça ne sert absolument à rien, mais tu peux en être fier !<br></br>
            N'hésite pas à me partager ta découverte sur Twitter/X, ça me ferait plaisir 🤙
          </p>

          <a href={"https://www.x.com/tsuyobnha"} style={{ textDecoration: "none" }} target='_blank'>
            <p style={{ color: "#1da1f2" }}>@tsuyobnha</p>
          </a>
        </div>
      }
    />
  );
};

export default EasterEgg;
