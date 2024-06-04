import React, { useEffect, useState } from 'react';
import Popup from '../components/Popup';
import "../styles/popups/Details.scss";
import Tooltip from '../components/Tooltip';

const Details = ({ match, setDetailsOpen }) => {

    const [currentGame, setCurrentGame] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [category, setCategory] = useState('teams');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);

    useEffect(() => {
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
            .catch(error => {
                setNoData(true);
            });
    }, []);

    if (noData) {
        return (
            <Popup
                header="Statistiques avancées"
                setOpen={setDetailsOpen}
                body={
                    <p>Aucune donnée supplémentaire n'a été trouvé pour ce match ou une erreur est survenue.</p>
                }
            />
        );
    } else if (loading) {
        return (
            <Popup
                header="Statistiques avancées"
                setOpen={setDetailsOpen}
                body={
                    <div className='match-details'>
                        <div className='loading'>
                            <p>Chargement des données...</p>
                            <div className="loader"></div>
                        </div>
                    </div>
                }
            />
        );

    } else {

        let games = data.games;
        if (match.game === 'Valorant') {
            games = [{ map: 'All Maps', ...data.details }, ...games];
        }

        const game = games[currentGame];
        const players = Object.values(match.game === 'League of Legends' ? game.players : game.members);
        const player = players[currentPlayer];

        let length;
        let oppositePlayer;

        if (match.game === 'League of Legends') {
            length = Object.values(match.games)[currentGame].length;
            oppositePlayer = players.find(p => p.side !== player.side && p.role === player.role);
        }

        let teams;
        if (game.teams) teams = Object.values(game.teams);

        function updateCurrentData(type, add) {
            if (type === 'game') {
                if (add && currentGame < games.length - 1) {
                    setCurrentGame(currentGame + 1);
                } else if (!add && currentGame > 0) {
                    setCurrentGame(currentGame - 1);
                }

            } else if (type === 'player') {
                if (add && currentPlayer < players.length - 1) {
                    setCurrentPlayer(currentPlayer + 1);
                } else if (!add && currentPlayer > 0) {
                    setCurrentPlayer(currentPlayer - 1);
                }
            }
        }

        return (
            <Popup
                header="Statistiques avancées"
                setOpen={setDetailsOpen}
                body={
                    <div className='match-details'>
                        {match.game === 'League of Legends' ?
                            <div className='lol'>
                                <div className='game-selector'>
                                    <button style={{ borderRadius: '6px 0px 0px 6px' }} disabled={currentGame === 0} onClick={() => updateCurrentData('game', false)}>
                                        <i style={{ marginLeft: '3px' }} className='arrow left'></i>
                                    </button>
                                    <p>{`Game N°${currentGame + 1}`}</p>
                                    <button style={{ borderRadius: '0px 6px 6px 0px' }} disabled={currentGame === games.length - 1} onClick={() => updateCurrentData('game', true)}>
                                        <i style={{ marginRight: '3px' }} className='arrow right'></i>
                                    </button>
                                </div>
                                {category === 'teams' ?
                                    <div className='teams'>
                                        <div className='heading'>
                                            <div className='team'>
                                                <div>
                                                    <div className='logo'>
                                                        <img src={teams[0].avatar} alt={teams[0].name} />
                                                    </div>
                                                    <div className='name'>{teams[0].acronym}</div>
                                                </div>
                                                <div style={{ transform: 'rotate(180deg)', writingMode: 'vertical-rl', backgroundColor: teams[0].win ? 'green' : '#aa0a0a' }}>{teams[0].win ? 'VICTOIRE' : 'DÉFAITE'}</div>
                                            </div>
                                            <p className='vs'>VS</p>
                                            <div className='team'>
                                                <div className='status' style={{ writingMode: 'vertical-rl', backgroundColor: teams[1].win ? 'green' : '#aa0a0a' }}>{teams[1].win ? 'VICTOIRE' : 'DÉFAITE'}</div>
                                                <div>
                                                    <div className='logo'>
                                                        <img src={teams[1].avatar} alt={teams[1].name} />
                                                    </div>
                                                    <div className='name'>{teams[1].acronym}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className='cat-name'>Statistiques</p>
                                        <div className='statistics'>

                                            <Element property='Dragons' value1={teams[0].dragons} value2={teams[1].dragons} />

                                            <Element property='Tours' value1={teams[0].towers} value2={teams[1].towers} />

                                            <Element property='Golds' value1={teams[0].gold} value2={teams[1].gold} />

                                            <div className='element'>
                                                <p className={teams[0].kda < teams[1].kda ? 'red' : 'green'}>{`${teams[0].kills}/${teams[0].deaths}/${teams[0].assists}`}</p>
                                                <p className='name'>É/M/A</p>
                                                <p className={teams[1].kda < teams[0].kda ? 'red' : 'green'}>{`${teams[1].kills}/${teams[1].deaths}/${teams[1].assists}`}</p>
                                            </div>

                                            <Element property='Dégâts' value1={teams[0].damage} value2={teams[1].damage} />
                                        </div>

                                        <p className='cat-name'>Picks et Bans</p>
                                        <div className='champions'>
                                            <div className='team1'>
                                                <div className='picks'>
                                                    {players.filter(player => player.side === "1").map((player, index) => (
                                                        <Pick key={index} player={player} setCategory={setCategory} setCurrentPlayer={setCurrentPlayer} players={players} />
                                                    ))}
                                                </div>

                                                <div className='bans'>
                                                    {teams[0].bans.map((champion, index) => (
                                                        <Ban key={index} {...champion} />
                                                    ))}

                                                </div>
                                            </div>

                                            <div className='team2'>
                                                <div className='picks'>
                                                    {players.filter(player => player.side === "2").map((player, index) => (
                                                        <Pick key={index} player={player} setCategory={setCategory} setCurrentPlayer={setCurrentPlayer} players={players} />
                                                    ))}
                                                </div>

                                                <div className='bans'>
                                                    {teams[1].bans.map((champion, index) => (
                                                        <Ban key={index} {...champion} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div> :

                                    category === 'players' ?
                                        <div className='players'>
                                            <div className='player'>
                                                <div className='left'>
                                                    <div className='infos'>
                                                        <div className='avatar'><img src={player.avatar} alt={player.name} /></div>
                                                        <div className='info'>
                                                            <div>{player.name}</div>
                                                            <div>{player.team}</div>
                                                            <div>{player.role}</div>
                                                        </div>
                                                    </div>
                                                    <div className='items'>
                                                        {[...player.items, player.trinket].map((item, index) => (
                                                            <Tooltip key={index}
                                                                content={item.name}
                                                                direction="top"
                                                                delay="100"
                                                            >
                                                                <img src={item.icon} alt={item.name} />
                                                            </Tooltip>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className='right'>
                                                    <div className='runes'>
                                                        <img src={player.keystonerune.icon} alt={player.keystonerune.name} />
                                                        <img src={player.secondarytree.icon} alt={player.secondarytree.name} />
                                                    </div>
                                                    <div className='champion'>
                                                        <img className='icon' src={player.champion.icon} alt={player.champion.name} />
                                                        <div className='summoners'>
                                                            <img src={player.summoners[0].icon} alt={player.summoners[0].name} />
                                                            <img src={player.summoners[1].icon} alt={player.summoners[1].name} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='statistics'>
                                                <p className='title'>{`Statistiques VS. ${oppositePlayer.name}`}</p>
                                                <div className='elements'>
                                                    <div className='element'>
                                                        <p className={player.kda < oppositePlayer.kda ? 'red' : 'green'}>{`${player.kills}/${player.deaths}/${player.assists}`}</p>
                                                        <p className='name'>K/D/A</p>
                                                        <p className={oppositePlayer.kda < player.kda ? 'red' : 'green'}>{`${oppositePlayer.kills}/${oppositePlayer.deaths}/${oppositePlayer.assists}`}</p>
                                                    </div>

                                                    <Element property='Golds' value1={player.gold} value2={oppositePlayer.gold} />

                                                    <Element property='Dégâts' value1={player.damage} value2={oppositePlayer.damage} />

                                                    <div className='element'>
                                                        <Tooltip
                                                            content={`${(player.cs / length * 60).toFixed(1)} CS/M`}
                                                            direction="top" delay="100"
                                                        >
                                                            <p className={player.cs < oppositePlayer.cs ? 'red' : 'green'}>{player.cs}</p>
                                                        </Tooltip>
                                                        <p className='name'>CS</p>
                                                        <Tooltip
                                                            content={`${(oppositePlayer.cs / length * 60).toFixed(1)} CS/M`}
                                                            direction="top" delay="100"
                                                        >
                                                            <p className={oppositePlayer.cs < player.cs ? 'red' : 'green'}>{oppositePlayer.cs}</p>
                                                        </Tooltip>
                                                    </div>

                                                    <Element property='Vision' value1={player.vision} value2={oppositePlayer.vision} />
                                                </div>
                                            </div>

                                            <div className='player-selector'>
                                                <button disabled={currentPlayer === 0} onClick={() => updateCurrentData('player', false)}>
                                                    <i className='arrow left'></i>
                                                </button>
                                                <p>{player.name}</p>
                                                <button disabled={currentPlayer === players.length - 1} onClick={() => updateCurrentData('player', true)}>
                                                    <i className='arrow right'></i>
                                                </button>
                                            </div>
                                        </div> :

                                        category === 'graph' ?
                                            <div className='graph'>

                                            </div> :

                                            <div>Erreur</div>
                                }

                                <div className='categories'>
                                    <button className={category === 'teams' ? 'selected' : ''} onClick={() => setCategory('teams')}>
                                        <img src="assets/icones/utilisateur.png" alt="" />
                                        Équipes
                                    </button>
                                    <button className={category === 'players' ? 'selected' : ''} onClick={() => setCategory('players')}>
                                        <img src="assets/icones/utilisateur.png" alt="" />
                                        Joueurs
                                    </button>
                                    <button className={category === 'graph' ? 'selected' : ''} onClick={() => setCategory('graph')}>
                                        <img src="assets/icones/graph.png" alt="" />
                                        Graphique
                                    </button>
                                </div>
                            </div> :

                            match.game === 'Valorant' ?
                                <div className='valorant'>
                                    <div className='game-selector'>
                                        <button style={{ borderRadius: '6px 0px 0px 6px' }} disabled={currentGame === 0} onClick={() => updateCurrentData('game', false)}>
                                            <i style={{ marginLeft: '3px' }} className='arrow left'></i>
                                        </button>
                                        <p>{game.map}</p>
                                        <button style={{ borderRadius: '0px 6px 6px 0px' }} disabled={currentGame === games.length - 1} onClick={() => updateCurrentData('game', true)}>
                                            <i style={{ marginRight: '3px' }} className='arrow right'></i>
                                        </button>
                                    </div>
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
                    </div>
                }
            />
        );
    }
};

const Pick = ({ player, setCategory, setCurrentPlayer, players }) => {
    return (
        <Tooltip
            content={
                <>
                    {`${player.name}`}<br></br>
                    {player.champion.name}
                </>
            }
            direction="top"
            delay="100"
        >
            <img onClick={() => {
                setCategory('players');
                setCurrentPlayer(players.findIndex(p => p.name === player.name));
            }} className='pick'
                src={player.champion.icon} alt={player.champion.name} />
        </Tooltip>
    )
}

const Ban = (champion) => {
    return (
        <Tooltip
            content={`Ban - ${champion.name}`}
            direction="top"
            delay="100"
        >
            <img className='ban'
                src={champion.icon} alt={champion.name} />
        </Tooltip>
    )
}

const Element = ({ property, value1, value2 }) => {
    return (
        <div className='element'>
            <p className={value1 < value2 ? 'red' : 'green'}>{value1}</p>
            <p style={{ fontFamily: 'Roboto, \'sans-serif\'' }} className='name'>{property}</p>
            <p className={value2 < value1 ? 'red' : 'green'}>{value2}</p>
        </div>
    )
}

export default Details;