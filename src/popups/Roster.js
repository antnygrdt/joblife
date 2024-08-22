import React, { useEffect, useState } from 'react';
import Popup from '../components/Popup';
import '../styles/popups/Roster.scss';

const Roster = ({ roster, members, setOpen }) => {

  const seasons = Object.entries(roster.seasons).map(([name, value]) => ({ name, ...value }));
  const [currentSeason, setCurrentSeason] = useState(seasons.length - 1);

  const splits = Object.entries(seasons[currentSeason].splits).map(([name, value]) => ({ name, ...value }));
  const [currentSplit, setCurrentSplit] = useState(splits.length - 1);

  const [currentCategory, setCurrentCategory] = useState('players');
  const [standings, setStandings] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    chrome.storage.local.get(['JOBLIFE_STANDINGS', 'JOBLIFE_TEAMS'], (result) => {
      if (result.JOBLIFE_STANDINGS !== undefined) {
        setStandings(result.JOBLIFE_STANDINGS);
      }

      if (result.JOBLIFE_TEAMS !== undefined) {
        setTeams(result.JOBLIFE_TEAMS);
      }
    });
  }, []);

  const standing = Object.entries(standings).find(([key, value]) => key === splits[currentSplit].league_id);

  return <Popup
    header={<h1 style={{ fontSize: '18px' }}>{roster.name.toUpperCase()}</h1>}
    headerStyle={{ backgroundColor: '#1b2c62' }}
    containerStyle={{ maxHeight: '600px' }}
    setOpen={setOpen}
    body={
      <div className='roster'>
        <div className='select'>
          <select defaultValue={currentSeason} onChange={(event) => {
            setCurrentSeason(event.target.value);
          }}>
            {seasons
              .map((season, index) => (
                <option key={`ligue-${index}`} value={index}>{season.name}</option>
              ))}
          </select>
          <select defaultValue={currentSplit} onChange={(event) => {
            setCurrentSplit(event.target.value);
          }}>
            {splits
              .sort((a, b) => a.position - b.position)
              .map((split, index) => (
                <option key={`ligue-${index}`} value={index}>{split.name}</option>
              ))}
          </select>
        </div>

        <div className='categories'>
          <ul>
            <li className={currentCategory === 'players' ? 'selected' : ''}>
              <div className='category' onClick={() => setCurrentCategory('players')}>
                <img src="assets/icones/navigation/4.png" alt="Joueurs" />
                <p>Joueurs</p>
              </div>
            </li>
            <li className={currentCategory === 'standings' ? 'selected' : ''}>
              <div className='category' onClick={() => setCurrentCategory('standings')}>
                <img src="assets/icones/medals.png" alt="Classement" />
                <p>Classement</p>
              </div>
            </li>
            {/* <li>
                    <button>Titres</button>
                    </li> */}
          </ul>
        </div>

        {currentCategory === 'players' ?
          <div className='players'>
            <div className='split scroll-bar'>
              {Object.values(combineObjects(splits[currentSplit].players, members))
                .sort((a, b) => a['index'] - b['index'])
                .map((player) => (
                  <Player key={player.id} player={player} />
                ))
              }
            </div>
          </div> :
          <div className='rankings'>
            {(() => {
              return standing !== undefined ?
                <div>
                  <div className='standings'>
                    <div className='standing placeholder'>
                      <p className='place placeholder'>Place</p>
                      <div className='team placeholder'><p>Équipe</p></div>
                      <p className='wins placeholder'>Vict.</p>
                      <p className='losses placeholder'>Déf.</p>
                    </div>
                    <div className='teams scroll-bar'>
                      {standing[1].standings
                        .sort((a, b) => a.n - b.n)
                        .map((standing, index) => {
                          const team = teams.find(team => team.id === standing.id);

                          return (
                            <div className='standing' key={index}>
                              <p className={`place n${standing.n}`}>{standing.n}</p>
                              <div className='team'>
                                <img className='avatar' src={team.avatar} alt={team.acronym} />
                                <p className='name'>{team.name}</p>
                              </div>
                              <p className='wins'>{standing.wins}</p>
                              <p className='losses'>{standing.losses}</p>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                  <p>Saison régulière - Dernière mise à jour :</p>
                  <p>{standing[1].last_update}</p>
                </div> :
                <p>Aucun classement disponible</p>
            })()}
          </div>
        }
      </div>
    }
  />
};

const Player = ({ player }) => {
  return (
    <>
      <div className='player'>
        <img src={player.avatar} alt={player.nickname} className='icone' />
        <div className='infos1'>
          <p className='nickname'>{player.nickname}</p>
          <p className='name'>{player.name}</p>
          <p className='role'>{player.role}</p>
        </div>
        <div className='infos2'>
          {player.twitch &&
            <a href={'https://twitch.tv/' + player.twitch} target='_blank'>
              <img src="./assets/icones/twitch.png" alt="" />
            </a>
          }
          <a href={'https://x.com/' + player.twitter} target='_blank'>
            <img src="./assets/icones/x.png" alt="" />
          </a>
        </div>
      </div>
    </>
  );
};

function combineObjects(obj1, obj2) {
  let combined = { ...obj1 };

  for (let key in obj1) {
    combined[key] = { ...obj1[key], ...obj2[key] };
  }

  return Object.entries(combined).map(([id, value]) => ({ id, ...value }));
}

export default Roster;