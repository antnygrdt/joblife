import React, { useState, useEffect } from 'react';
import Popup from '../components/Popup';
import '../styles/popups/Roster.scss';

const Roster = ({ roster, members, setOpen }) => {

    const seasons = Object.entries(roster.seasons);
    const [currentSeason, setCurrentSeason] = useState(seasons.length - 1);

    const splits = Object.entries(seasons[currentSeason][1].splits);
    const [currentSplit, setCurrentSplit] = useState(splits.length - 1);

    const [currentCategory, setCurrentCategory] = useState('players');
    const [leagues, setLeagues] = useState({});
    const [currentLeague, setCurrentLeague] = useState(0);
    const [teams, setTeams] = useState([]);

    const leagueIds = splits.flatMap(split => split[1].league_id).filter(Boolean);

    useEffect(() => {
        chrome.storage.local.get(['JOBLIFE_STANDINGS', 'JOBLIFE_TEAMS'], (result) => {
            if (result.JOBLIFE_STANDINGS !== undefined) {
                setLeagues(Object.entries(result.JOBLIFE_STANDINGS).filter(([key, value]) => leagueIds.includes(key)));
            }

            if (result.JOBLIFE_TEAMS !== undefined) {
                setTeams(result.JOBLIFE_TEAMS);
            }
        });
    }, []);

    return <Popup
        header={<h1 style={{ fontSize: '18px' }}>{roster.name.toUpperCase()}</h1>}
        containerStyle={{ maxHeight: '500px' }}
        setOpen={setOpen}
        body={
            <div className='roster'>
                {seasons.length > 1 &&
                    <div className='categories'>
                        {seasons
                            .sort((a, b) => a.position - b.position)
                            .map(([key, season], index) => (
                                <button className={currentSeason === index ? 'selected' : ''} key={key} onClick={() => setCurrentSeason(index)}>{key}</button>
                            ))}
                    </div>
                }
                {splits.length > 1 &&
                    <div className='categories'>
                        {splits
                            .sort((a, b) => a.position - b.position)
                            .map(([key, split], index) => (
                                <button className={currentSplit === index ? 'selected' : ''} key={key} onClick={() => setCurrentSplit(index)}>{key}</button>
                            ))}
                    </div>
                }
                <div className='categories'>
                    <button className={currentCategory === 'players' ? 'selected' : ''} onClick={() => setCurrentCategory('players')}>Joueurs</button>
                    <button className={currentCategory === 'standings' ? 'selected' : ''} onClick={() => setCurrentCategory('standings')}>Classements</button>
                    {/* <button>Titres</button> */}
                </div>
                {currentCategory === 'players' ?
                    <div className='players scroll-bar'>
                        <div className='split scroll-bar'>
                            {Object.entries(combineObjects(splits[currentSplit][1].players, members))
                                .sort((a, b) => a[1]['index'] - b[1]['index'])
                                .map(([name, player]) => (
                                    <Player key={name} player={player} />
                                ))
                            }
                        </div>
                    </div> :
                    <div className='rankings' style={{ width: `${100 * leagues.length}%`, transform: `translateX(-${currentLeague * 100 / leagues.length}%)` }}>
                        {leagues.length > 0 ?
                            leagues.map(([key, value], index) => (
                                <div className='standings' key={index} style={{ width: `${100 * leagues.length}%` }}>
                                    {value.standings.map((standing, index) => {
                                        const team = teams.filter(team => team.name === standing.name || team.acronym === standing.acronym)[0]
                                        const avatar = team ? team.avatar : 'https://i.imgur.com/fClqezv.png';

                                        return (
                                            <div className='standing' key={index}>
                                                <p className='place'>#{standing.place}</p>
                                                <div className='team'>
                                                    <img className='avatar' src={avatar} alt={standing.acronym} />
                                                    <p className='name'>{standing.name}</p>
                                                </div>
                                                <p className='wins'>{standing.wins}</p>
                                                <p className='losses'>{standing.losses}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            )) :
                            <p>Aucun classement disponible</p>
                        }
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
                <img src={player.avatar} alt={player.nickname} className='icone' onClick={() => setImageOpen(true)} />
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

    return combined;
}

export default Roster;