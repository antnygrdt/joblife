import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clamp } from '../Utils';

const Details = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const match = state.match;

  const [currentGame, setCurrentGame] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [category, setCategory] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    document.body.style.width = '800px';
    document.body.style.height = '600px';

    fetch(`https://api.asakicorp.com/joblife/details/${match.id}`)
      .then(response => {
        if (!response.ok) {
          setNoData(true);
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setNoData(true);
      });

    return () => {
      document.body.style.width = state.width;
      document.body.style.height = state.height;
    };
  }, []);

  const ReturnButton = () => {
    return (
      <button className='return' onClick={() => navigate('/calendar', {
        state: {
          id: match.id,
          filters: state.filters,
          isUnrolled: state.isUnrolled
        }
      })}>
        Retourner au calendrier
      </button>
    );
  }

  if (noData) {

    return <div className='match-details'>
      <ReturnButton />
      <p>Aucune donnée supplémentaire n'a été trouvé pour ce match ou une erreur est survenue.</p>
    </div>;

  } else if (loading) {

    return <div className='match-details'>
      <ReturnButton />
      <div className='loading'>
        <p>Chargement des données...</p>
        <div className="loader"></div>
      </div>
    </div>;

  } else {

    let games = Object.values(data.games);

    const game = games[currentGame];
    const players = Object.values(match.game === 'League of Legends' ? game.players : game.members);

    const teams = Object.values(game.teams);

    teams.forEach(team => {
      team.players = players.filter(player => player.team === team.name);
    });

    const Items = (items, trinket, side) => {
      const elements = [];

      for (let i = 0; i < 6; i++) {
        if (i < items.length) {
          const item = items[i];
          elements.push(<img key={i} className='item' src={item.icon} alt={item.name} title={`${item.name}`} />);
        } else {
          elements.push(<div className="item blank" key={i}></div>);
        }
      }

      elements.push(<img key={6} className='item' src={trinket.icon} alt={trinket.name} title={`${trinket.name}`} />);

      return elements;
    }

    const KdaSVG = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" title="Kills / Deaths / Assists" className={className}>
      <path d="M -0.5,4.5 C 53.9293,17.2087 101.263,42.7087 141.5,81C 172.68,112.014 203.68,143.18 234.5,174.5C 213.347,196.153 192.014,217.653 170.5,239C 169.833,239.667 169.167,239.667 168.5,239C 136.667,207.167 104.833,175.333 73,143.5C 37.5394,104.587 13.0394,59.5868 -0.5,8.5C -0.5,7.16667 -0.5,5.83333 -0.5,4.5 Z" />
      <path d="M 511.5,4.5 C 511.5,5.83333 511.5,7.16667 511.5,8.5C 497.874,60.0948 473.04,105.428 437,144.5C 358,223.5 279,302.5 200,381.5C 199.333,382.167 199.333,382.833 200,383.5C 210,393.5 220,403.5 230,413.5C 228.763,416.776 226.597,419.609 223.5,422C 197.996,439.21 172.996,438.543 148.5,420C 129.305,401.138 110.471,381.972 92,362.5C 78.0015,340.154 78.0015,317.821 92,295.5C 94.6465,291.686 97.8132,288.353 101.5,285.5C 111.986,295.486 122.319,305.652 132.5,316C 133.167,316.667 133.833,316.667 134.5,316C 213.167,237.333 291.833,158.667 370.5,80C 410.58,42.288 457.58,17.1214 511.5,4.5 Z" />
      <path d="M 340.5,281.5 C 341.239,281.369 341.906,281.536 342.5,282C 354.014,293.681 365.681,305.181 377.5,316.5C 387.986,306.514 398.319,296.348 408.5,286C 409.167,285.333 409.833,285.333 410.5,286C 432.434,309.307 435.267,334.807 419,362.5C 398.469,384.698 376.969,405.864 354.5,426C 334.146,437.331 313.813,437.331 293.5,426C 288.399,423.067 284.065,419.234 280.5,414.5C 290.833,403.833 301.167,393.167 311.5,382.5C 299.833,370.5 288.167,358.5 276.5,346.5C 297.854,324.813 319.188,303.146 340.5,281.5 Z" />
      <path d="M 79.5,392.5 C 94.0984,406.763 108.765,421.097 123.5,435.5C 100.14,459.693 76.3067,483.36 52,506.5C 37.6745,492.341 23.5078,478.008 9.5,463.5C 32.8545,439.812 56.1878,416.146 79.5,392.5 Z" />
      <path d="M 429.5,392.5 C 454.096,415.428 478.096,439.095 501.5,463.5C 487.5,478.167 473.167,492.5 458.5,506.5C 434.5,483.167 410.833,459.5 387.5,435.5C 402.192,421.809 416.192,407.475 429.5,392.5 Z" />
    </svg>;

    const GoldSVG = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" title="Golds">
      <path className="cls-1" d="M98,37.74c0-14.67-17.84-26.56-39.85-26.56S18.33,23.07,18.33,37.74a18.57,18.57,0,0,0,1.73,7.75C9.21,49.65,2,57,2,65.33c0,13,17.38,23.49,38.82,23.49S79.63,78.3,79.63,65.33a14.79,14.79,0,0,0-.85-4.89C90.3,55.79,98,47.38,98,37.74ZM37.74,76.56c-13,0-23.5-5.49-23.5-12.26,0-4.59,4.86-8.59,12-10.69C33.54,60.09,45.1,64.3,58.17,64.3c1,0,2,0,3.06-.1,0,0,0,.07,0,.1C61.24,71.07,50.72,76.56,37.74,76.56Z" />
    </svg>;

    const GameSelector = () => {
      return (
        <div className='game-selector'>
          <button disabled={currentGame === 0} onClick={() => setCurrentGame(clamp(currentGame - 1, 0, games.length - 1))}>
            <i className='arrow left'></i>
          </button>
          <p>{`Game N°${currentGame + 1}`}</p>
          <button disabled={currentGame === games.length - 1} onClick={() => {
            console.log(currentGame);
            console.log(games.length);
            console.log(clamp(currentGame + 1, 0, games.length - 1));
            setCurrentGame(clamp(currentGame + 1, 0, games.length - 1));
          }}>
            <i style={{ marginRight: '3px' }} className='arrow right'></i>
          </button>
        </div>
      );
    }

    return <div className='match-details'>
      <ReturnButton />
      <GameSelector />

      {match.game === 'League of Legends' ?



        <div className='lol'>
          {teams.map((team, index) => (
            <div key={index} className='team'>
              <div className='left'>
                <div className='placeholder'>
                  <p className={`item-1 ${team.side}`}>{`Équipe ${index + 1}`}</p>
                  <div className='item-2'>
                    <p className={`${team.side}`}>{`${team.kills} / ${team.deaths} / ${team.assists}`}</p>
                    <KdaSVG className={`${team.side}`} />
                  </div>
                  <div className='item-3'>
                    <p>{`${team.gold}`}</p>
                    <GoldSVG />
                  </div>
                  <div className='statistic'>
                    <KdaSVG />
                  </div>
                  <div className='statistic'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                      <path className="cls-1" d="M56.61,1.56H43.39L8.17,50.92V63.21L43.39,98.44H56.61L91.83,63.21V50.92ZM54.4,80.83H45.6L28,56.61l.14-13.22h8.67L43.25,50h13.5l6.46-6.61h8.67L72,56.61Z" />
                    </svg>
                  </div>
                  <div className='statistic'>
                    <GoldSVG />
                  </div>
                </div>
                <div className='players'>
                  {team.players.map((player, index) => (
                    <div key={index} className='player'>
                      <div className='item-1'>
                        <img className='keystone' src={player.keystonerune.icon} alt={player.keystonerune.name} />
                        <div className='summoners'>
                          {player.summoners.map((summoner, index) => (
                            <img key={index} src={summoner.icon} alt={summoner.name} />
                          ))}
                        </div>
                      </div>
                      <div className='item-2'>
                        <img className='champion' src={player.champion.icon} alt={player.champion.name} title={player.champion.name} />
                        <p className='name'>{player.name}</p>
                      </div>
                      <div className='item-3'>
                        {Items(player.items, player.trinket)}
                      </div>
                      <p className='statistic'>{`${player.kills}/${player.deaths}/${player.assists}`}</p>
                      <p className='statistic'>{player.vision}</p>
                      <p className='statistic'>{player.gold}</p>
                    </div>
                  ))}
                </div>
              </div>

              <span className='middle'></span>

              <div className='right'>
                <p className='title'>Banissements & objectifs</p>
                <div className='bans'>
                  {team.bans.map((ban, index) => (
                    <img key={index} className='ban' src={ban.icon} alt={ban.name} title={ban.name} />
                  ))}
                </div>
                <div className='objectives'>
                  <div className='item'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                      <polygon className="cls-1" points="53.63 70.18 49.86 70.18 46.08 70.18 23.43 49.41 38.53 98.5 49.86 98.5 61.19 98.5 76.29 49.41 53.63 70.18" />
                      <path className="cls-1" d="M70.59,30.53l0-9.43L55.52,2.22H44.19L29.09,21.1l0,9.43H21.54v7.56L45.66,60.86h8.4L78.18,38.09V30.53Zm-15.07.7v6.16a.7.7,0,0,1-.7.7H44.89a.71.71,0,0,1-.7-.7V31.23a.7.7,0,0,0-.7-.7H39.24a.69.69,0,0,1-.7-.7l.08-8a.69.69,0,0,1,.7-.69h4.17a.7.7,0,0,0,.7-.71V14.25a.7.7,0,0,1,.71-.7l5,0,5,0a.7.7,0,0,1,.7.7v6.14a.71.71,0,0,0,.7.71H60.4a.69.69,0,0,1,.7.69l.08,8a.7.7,0,0,1-.7.7H56.22A.71.71,0,0,0,55.52,31.23Z" />
                    </svg>
                    <p>{team.towers ?? '?'}</p>
                  </div>
                  <div className='item'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" title='Inhibiteurs'>
                      <path className="cls-1" d="M55.41,31.06a2.89,2.89,0,0,0-2-.84H47.72a2.92,2.92,0,0,0-2,.84L31,45.72a2.91,2.91,0,0,0-.85,2.05v5.65a2.91,2.91,0,0,0,1,2.19L45.64,68.33a2.89,2.89,0,0,0,1.91.71h6a2.91,2.91,0,0,0,1.91-.71L70,55.61a2.91,2.91,0,0,0,1-2.19V47.77a2.91,2.91,0,0,0-.85-2.05Z" />
                      <path className="cls-1" d="M49.52,3.65a46,46,0,1,0,46,46A46,46,0,0,0,49.52,3.65Zm0,81.74A35.76,35.76,0,1,1,85.28,49.63,35.76,35.76,0,0,1,49.52,85.39Z" />
                    </svg>
                    <p>{team.inhibitors ?? '?'}</p>
                  </div>
                  <div className='item'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                      <path className="cls-1" d="M61.33,1H55.66V8.56L73.6,27.44l-.95,5.66-1.88,3.78H57.55L55.66,35V27.44H44.34V35l-1.89,1.89H29.23L27.35,33.1l-1-5.66L44.34,8.56V1H38.67L2.8,20.8V36.88L31.67,99h8.89V87.85H59.44V99h8.89L97.2,36.88V20.8Zm-20,66.07H32.25A1.13,1.13,0,0,1,31.12,66V56.88a1.14,1.14,0,0,1,1.13-1.13h9.07a1.14,1.14,0,0,1,1.13,1.13V66A1.13,1.13,0,0,1,41.32,67.08ZM54.54,78.41H45.46a1.13,1.13,0,0,1-1.12-1.13V70.1A1.12,1.12,0,0,1,45.46,69h9.08a1.12,1.12,0,0,1,1.12,1.13v7.18A1.13,1.13,0,0,1,54.54,78.41Zm0-24.54H45.46a1.13,1.13,0,0,1-1.12-1.13V45.55a1.12,1.12,0,0,1,1.12-1.12h9.08a1.12,1.12,0,0,1,1.12,1.12v7.19A1.13,1.13,0,0,1,54.54,53.87ZM67.75,67.08H58.68A1.13,1.13,0,0,1,57.55,66V56.88a1.14,1.14,0,0,1,1.13-1.13h9.07a1.14,1.14,0,0,1,1.13,1.13V66A1.13,1.13,0,0,1,67.75,67.08Z" />
                    </svg>
                    <p>{team.heralds ?? '?'}</p>
                  </div>
                  <div className='item'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                      <path className="cls-1" d="M99.06,29H81.44l.31-25.2H73.12L62.51,19.22,54.81,1.9H45.19l-7.7,17.32L26.88,3.82H18.25L18.56,29H.94v5.59h0L18.25,49.13v22h0l27,26.94h9.5l27-26.94h0v-22L99.06,34.61ZM45.19,64.86H37.51L27.87,50V40.38h2L45.19,53.85ZM74.05,51.92,64.41,66.79H56.73v-11L72.1,42.3h2Z" />
                    </svg>
                    <p>{team.dragons ?? '?'}</p>
                  </div>
                  <div className='item'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                      <polyline className="cls-1" points="19.37 82.84 19.37 92.28 11.82 92.28 0.49 79.06 0.49 73.7 6.16 73.7 6.16 68.04 13.53 68.04 19.37 82.84" />
                      <polyline className="cls-1" points="79.78 82.84 79.78 92.28 87.33 92.28 98.66 79.06 98.66 73.7 93 73.7 93 68.04 85.63 68.04 79.78 82.84" />
                      <polygon className="cls-1" points="49.58 46.97 45.91 46.97 42.03 52.63 42.03 61.74 45.8 65.85 49.58 65.85 53.35 65.85 57.13 61.74 57.13 52.63 53.25 46.97 49.58 46.97" />
                      <path className="cls-1" d="M74.12,7.33H66.57V26.2h-34V7.33H25L6.16,33.39V58.3L33.81,86.62H65.35L93,58.3V33.39ZM66.57,62.07,57.13,73.4H42L32.59,62.07V48.86l9-9.41h16l9,9.41Z" />
                    </svg>
                    <p>{team.barons ?? '?'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div> :

        match.game === 'Valorant' ?
          <div className='valorant'>

            <GameSelector />

            {category === 'teams' ?
              <div className='teams'>

              </div> :

              category === 'players' ?
                <div className='players'>

                </div> :

                category === 'graph' ?
                  <div className='graph'>

                  </div> :

                  <div>Erreur</div>
            }
          </div>

          : <div></div>
      }

    </div>;
  };
};

export default Details;