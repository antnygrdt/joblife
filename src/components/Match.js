import React, { useState } from 'react';
import moment from 'moment';
import Game from './Game';

const Match = ({ match }) => {
    const [unrolled, setUnroll] = useState(false);

    if (!match.team1 || !match.team2) {
        return null;
    }

    let isFinished = match.status === "finished";

    const date = moment.utc(match.scheduled_at).locale('fr');
    const now = moment();

    const isToday = date.isSame(now, 'day');
    const isRunning = match.status === "running";

    const duration = moment.duration(now.diff(date));

    const days = duration.asDays();
    const hours = duration.asHours();

    var dateFormat;
    if (days > 6 || !isFinished) {
        dateFormat = date.format('dddd D MMMM YYYY').toUpperCase();
    } else if (days >= 1) {
        dateFormat = `Il y a ${Math.floor(days)} jour${Math.floor(days) > 1 ? 's' : ''}`;
    } else if (hours >= 1) {
        dateFormat = `Il y a ${Math.floor(hours)} heures`;
    } else dateFormat = 'Il y a 1 heure';

    const hourFormat = date.format('HH:mm');


    let teamsHint = null, winner = null;
    if (isFinished || isRunning) {
        winner = match.winner_id === match.team1.id ? match.team1 : match.winner_id === match.team2.id ? match.team2 : null;
        if (winner === null && !isRunning) return;

        let [wins1, wins2] = [0, 0];
        for (let game of Object.values(match.games)) {
            const gameWinnerId = game.winner_id;
            if (gameWinnerId === match.team1.id) {
                wins1++;
            } else if (gameWinnerId === match.team2.id) {
                wins2++;
            }
        }

        teamsHint = `${wins1} - ${wins2}`;
    } else {
        teamsHint = hourFormat;
    }

    return (
        <div className='match-card'>
            <div className={"header" + (isToday && !isRunning ? " matchday" : "")}>
                <p>{dateFormat}</p>
                {isRunning && <div className='running '>
                    <p title='En cours...'>🔴</p>
                </div>}
            </div>
            <div className={"match " + match.status + (unrolled ? ' unrolled' : '')} onClick={() => setUnroll(!unrolled)}>
                <div className="league">
                    <img src={match.league_avatar} alt={"Logo " + match.league_slug} />
                    <p >{match.league_slug}</p>
                </div>
                <div className="team">
                    {isFinished &&
                        <p className={'wl ' + (match.team1.id === winner.id ? "V" : "D")}>{match.team1.id === winner.id ? "WIN" : "LOSE"}</p>
                    }
                    <img src={match.team1.avatar} alt={match.team1.name} title={match.team1.name} />
                    <p className={"teams-hint"}>{teamsHint}</p>
                    <img src={match.team2.avatar} alt={match.team2.name} title={match.team2.name} />
                    {isFinished &&
                        <p className={'wl ' + (match.team2.id === winner.id ? "V" : "D")}>{match.team2.id === winner.id ? "WIN" : "LOSE"}</p>
                    }
                </div>
                <div className="arrow">
                    <img src={"./assets/icones/" + (unrolled ? "arrow-down" : "arrow-right") + ".png"} alt="Icone chevron" />
                </div>
            </div>
            {unrolled &&
                <div className='footer'>
                    <ul className='game-list'>
                        <h2 className='line'><span>DÉTAILS</span></h2>
                        {Object.entries(match.games).map(([key, game], index) => (
                            <li key={`game-${index}`}>
                                <Game match={match} game={game} index={index} />
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    );
};

export default Match;