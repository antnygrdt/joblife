import { useEffect, useState } from 'react';
import Popup from '../components/Popup';
import '../styles/popups/Roster.scss';
import ZoomImage from '../components/ZoomImage';
import { clamp } from '../Utils';
import type { Roster, Member, Team } from '../interfaces';

interface RosterProps {
  roster: Roster;
  members: { [key: string]: Member };
  setOpen: (open: boolean) => void;
}

interface Player {
  id: string;
  nickname: string;
  name: string;
  role: string;
  avatar: string;
  twitch?: string;
  twitter: string;
  index: number;
}

interface PlayerProps {
  player: Player;
}

const Roster = ({ roster, members, setOpen }: RosterProps) => {
  const seasons = Object.entries(roster.seasons as { [key: string]: any }).map(([name, value]) => ({ name, ...value }));
  const [currentSeason, setCurrentSeason] = useState(seasons.length - 1);

  const splits = Object.entries(seasons[currentSeason].splits as { [key: string]: any }).map(([name, value]) => ({ name, ...value }));
  const [currentSplit, setCurrentSplit] = useState(splits.length - 1);

  const [currentCategory, setCurrentCategory] = useState<'players' | 'standings'>('players');
  const [standings, setStandings] = useState<{ [key: string]: any }>({});
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    chrome.storage.local.get(['JOBLIFE_STANDINGS', 'JOBLIFE_TEAMS'], (result) => {
      if (result.JOBLIFE_STANDINGS !== undefined && result.JOBLIFE_STANDINGS !== null) {
        setStandings(result.JOBLIFE_STANDINGS as { [key: string]: any });
      }

      if (result.JOBLIFE_TEAMS !== undefined && result.JOBLIFE_TEAMS !== null) {
        setTeams(result.JOBLIFE_TEAMS as Team[]);
      }
    });
  }, []);

  const getLeagueId = (): string | null => {
    const leagueId = splits[currentSplit].league_id;
    if (typeof leagueId === 'string') {
      return leagueId;
    } else if (Array.isArray(leagueId)) {
      return leagueId.find(id => Object.keys(standings).includes(id)) || leagueId[0] || null;
    }
    return null;
  };

  const standing = Object.entries(standings).find(([key]) => key === getLeagueId());

  return <Popup
    header={<h1 style={{ fontSize: '18px' }}>{roster.name.toUpperCase()}</h1>}
    headerStyle={{ backgroundColor: '#1b2c62' }}
    containerStyle={{ maxHeight: '600px' }}
    setOpen={setOpen}
    body={
      <div className='roster'>
        <div className='select'>
          <select defaultValue={currentSeason} onChange={(event) => {
            const newSeasonIndex = Number(event.target.value);
            setCurrentSeason(newSeasonIndex);
            const newSplits = Object.entries(seasons[newSeasonIndex].splits);
            setCurrentSplit((prevSplit) => clamp(prevSplit, 0, newSplits.length - 1));
          }}>
            {seasons
              .map((season, index) => (
                <option key={`season-${index}`} value={index}>{season.name}</option>
              ))}
          </select>
          <select value={currentSplit} onChange={(event) => {
            setCurrentSplit(Number(event.target.value));
          }}>
            {splits
              .sort((a, b) => a.position - b.position)
              .map((split, index) => (
                <option key={`split-${index}`} value={index}>{split.name}</option>
              ))}
          </select>
        </div>

        <div className='categories'>
          <ul>
            <li className={currentCategory === 'players' ? 'selected' : ''}>
              <div className='category' onClick={() => setCurrentCategory('players')}>
                <img src="/assets/icones/navigation/4.png" alt="Joueurs" />
                <p>Joueurs</p>
              </div>
            </li>
            <li className={currentCategory === 'standings' ? 'selected' : ''}>
              <div className='category' onClick={() => setCurrentCategory('standings')}>
                <img src="/assets/icones/medals.png" alt="Classement" />
                <p>Classement</p>
              </div>
            </li>
          </ul>
        </div>

        {currentCategory === 'players' ?
          <div className='players'>
            <div className='split scroll-bar'>
              {Object.values(combineObjects(splits[currentSplit].players, members))
                .sort((a, b) => a['index'] - b['index'])
                .map((player) => (
                  <PlayerComponent key={player.id} player={player as Player} />
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
                        .sort((a: any, b: any) => a.n - b.n)
                        .map((standing: any, index: number) => {
                          const team = teams.find(team => team.id === standing.id);

                          return (
                            <div className='standing' key={index}>
                              <p className={`place n${standing.n}`}>{standing.n}</p>
                              <div className='team'>
                                {team && <img className='avatar' src={team.avatar} alt={team.acronym} />}
                                <p className='name'>{team?.name || ''}</p>
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

const PlayerComponent = ({ player }: PlayerProps) => {
  return (
    <>
      <div className='player'>
        <ZoomImage src={player.avatar} alt={player.nickname} className='icone' />
        <div className='infos1'>
          <p className='nickname'>{player.nickname}</p>
          <p className='name'>{player.name}</p>
          <p className='role'>{player.role}</p>
        </div>
        <div className='infos2'>
          {player.twitch &&
            <a href={'https://twitch.tv/' + player.twitch} target='_blank'>
              <img src="/assets/icones/socials/twitch.png" alt="" />
            </a>
          }
          <a href={'https://x.com/' + player.twitter} target='_blank'>
            <img src="/assets/icones/socials/x.png" alt="" />
          </a>
        </div>
      </div>
    </>
  );
};

function combineObjects(obj1: { [key: string]: any }, obj2: { [key: string]: any }): { [key: string]: Player } {
  let combined = { ...obj1 };

  for (let key in obj1) {
    combined[key] = { ...obj1[key], ...obj2[key] };
  }

  return Object.entries(combined).reduce((acc, [id, value]) => {
    acc[id] = { id, ...value } as Player;
    return acc;
  }, {} as { [key: string]: Player });
}

export default Roster;