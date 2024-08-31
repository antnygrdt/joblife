import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Game from './Game';

moment.locale('fr');

const Match = ({ match, spoil: defaultSpoil, isUnrolled, isCalendarUnrolled, calendarFilters }) => {
  const [unrolled, setUnroll] = useState(isUnrolled);
  const [spoil, setSpoil] = useState(defaultSpoil);

  const navigate = useNavigate();

  useEffect(() => {
    setSpoil(defaultSpoil);

    if (match.status !== "finished" && match.status !== "running") {
      setSpoil(true);
    }
  }, [defaultSpoil]);

  if (!match.team1 || !match.team2) {
    return null;
  }

  const isFinished = match.status === "finished";

  const date = moment.utc(match.scheduled_at).locale('fr');
  const now = moment().local();

  const isToday = date.year() === now.year() &&
    date.month() === now.month() &&
    date.date() === now.date();

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
    dateFormat = `Il y a ${Math.floor(hours)} heure${Math.floor(hours) > 1 ? 's' : ''}`;
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
    <div>
      <div className='match-card' id={match.id}>
        <div className={"header" + (isToday && !isRunning && !isFinished ? " matchday" : "")}>
          <p>{dateFormat}</p>
          {isRunning && <div className='running '>
            <p title='En cours...'>🔴</p>
          </div>}
        </div>
        <div className={"match " + match.status + (unrolled ? ' unrolled' : '')} onClick={() => setUnroll(!unrolled)}>
          <div className="league" title={match.league + ' ' + match.serie + ' ' + match.tournament}>
            <img src={match.league_avatar} alt={"Logo " + match.league_slug} />
            <p >{match.league_slug}</p>
          </div>
          <div className="team">
            {(isFinished && spoil) &&
              <p className={'wl ' + (match.team1.id === winner.id ? "V" : "D")}>{match.team1.id === winner.id ? "WIN" : "LOSE"}</p>
            }
            <img src={match.team1.avatar} alt={match.team1.name} title={match.team1.name} />
            {spoil ?
              <p className={"teams-hint"}>{teamsHint}</p> :
              <button onClick={(e) => {
                e.stopPropagation();
                setSpoil(true);
              }}>
                <img style={{ width: '24px', alignSelf: 'center' }} src="assets/icones/eye2.png" alt="Spoils cachés" title='Afficher' />
              </button>
            }
            <img src={match.team2.avatar} alt={match.team2.name} title={match.team2.name} />
            {(isFinished && spoil) &&
              <p className={'wl ' + (match.team2.id === winner.id ? "V" : "D")}>{match.team2.id === winner.id ? "WIN" : "LOSE"}</p>
            }
          </div>
          <i className={unrolled ? 'arrow down' : 'arrow right'}></i>
        </div>
        <div className={`footer ${unrolled ? 'unrolled' : ''}`}>
          <h2 className='line'><span>DÉTAILS</span></h2>
          <ul className='game-list scroll-bar'>
            {Object.entries(match.games).map(([key, game], index) => (
              <li key={`game-${index}`}>
                <Game match={match} game={game} index={index} spoil={spoil} />
              </li>
            ))}
          </ul>
          {match.has_details &&
            <button className='show-details'
              title={`Informations fournies par ${match.game === 'League of Legends' ? 'Leaguepedia' : 'VLRgg'}`} onClick={() => {
                navigate('/details', {
                  state: {
                    match: match,
                    isUnrolled: isCalendarUnrolled,
                    filters: calendarFilters,
                    width: document.body.style.width,
                    height: document.body.style.height
                  }
                });
              }}>{`Afficher les statistiques détaillées${!spoil ? ' (spoils)' : ''}`}</button>
          }
        </div>
      </div>
    </div>
  );
};

export default Match;