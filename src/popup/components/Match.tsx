import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Match as MatchType, CalendarFilters } from '../interfaces';
import Game from './Game';
import 'moment/dist/locale/fr';

moment.locale('fr');

interface MatchProps {
  match: MatchType;
  spoil: boolean;
  isUnrolled: boolean;
  isCalendarUnrolled: boolean;
  calendarFilters: CalendarFilters;
}

const Match = ({ match, spoil: defaultSpoil, isUnrolled, isCalendarUnrolled, calendarFilters }: MatchProps) => {
  const [unrolled, setUnroll] = useState(isUnrolled);
  const [spoil, setSpoil] = useState(defaultSpoil);

  const navigate = useNavigate();

  useEffect(() => {
    setSpoil(defaultSpoil);

    if (match.status !== "finished" && match.status !== "running") {
      setSpoil(true);
    }
  }, [defaultSpoil, match.status]);

  if (!match.team1 || !match.team2 || typeof match.team1 === 'string' || typeof match.team2 === 'string') {
    return null;
  }

  const team1 = match.team1;
  const team2 = match.team2;

  const isFinished = match.status === "finished";

  const date = match.scheduled_at === "TBD" ? null : moment.tz(match.scheduled_at, moment.tz.guess()).locale('fr');
  const now = moment().local();

  const isToday = date && date.year() === now.year() &&
    date.month() === now.month() &&
    date.date() === now.date();

  const isRunning = match.status === "running";

  const duration = moment.duration(now.diff(date || now));

  const days = duration.asDays();
  const hours = duration.asHours();

  var dateFormat: string;
  var fullDateFormat = date ? date.format('dddd D MMMM YYYY').toUpperCase() : '';
  if (match.scheduled_at === "TBD") {
    dateFormat = "TBD - Date pas encore définie";
  } else if (days > 6 || !isFinished) {
    dateFormat = date ? date.format('dddd D MMMM YYYY').toUpperCase() : '';
  } else if (days >= 1) {
    dateFormat = `Il y a ${Math.floor(days)} jour${Math.floor(days) > 1 ? 's' : ''}`;
  } else if (hours >= 1) {
    dateFormat = `Il y a ${Math.floor(hours)} heure${Math.floor(hours) > 1 ? 's' : ''}`;
  } else dateFormat = 'Il y a 1 heure';


  const hourFormat = date ? date.format('HH:mm') : null;

  let teamsHint: string | null = null, winner: typeof team1 | null = null;
  if (isFinished || isRunning) {
    winner = match.winner_id === team1.id ? team1 : match.winner_id === team2.id ? team2 : null;
    if (winner === null && !isRunning) return null;

    let [wins1, wins2] = [0, 0];
    for (let game of Object.values(match.games)) {
      const gameWinnerId = game.winner_id;
      if (gameWinnerId === team1.id) {
        wins1++;
      } else if (gameWinnerId === team2.id) {
        wins2++;
      }
    }

    teamsHint = `${wins1} - ${wins2}`;
  } else {
    teamsHint = hourFormat;
  }

  if (match.scheduled_at === "TBD" || !match.scheduled_at.includes("T")) {
    teamsHint = "VS.";
  }

  return (
    <div>
      <div className='match-card' id={match.id}>
        <div className={"header" + (isToday && !isRunning && !isFinished ? " matchday" : "")}>
          <p title={dateFormat !== fullDateFormat ? fullDateFormat : ''}>{dateFormat}</p>
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
            {(isFinished && spoil && winner) &&
              <p className={'wl ' + (team1.id === winner.id ? "V" : "D")}>{team1.id === winner.id ? "WIN" : "LOSE"}</p>
            }
            <img
              src={team1.avatar}
              alt={team1.name}
              title={team1.name}
              onClick={(e) => {
                if (e.shiftKey) {
                  navigator.clipboard.writeText(team1.id);
                  e.stopPropagation();
                }
              }}
            />
            {spoil ?
              <p className={"teams-hint"}>{teamsHint}</p> :
              <button onClick={(e) => {
                e.stopPropagation();
                setSpoil(true);
              }}>
                <img style={{ width: '24px', alignSelf: 'center' }} src="/assets/icones/eye2.png" alt="Spoils cachés" title='Afficher' />
              </button>
            }
            <img
              src={team2.avatar}
              alt={team2.name}
              title={team2.name}
              onClick={(e) => {
                if (e.shiftKey) {
                  navigator.clipboard.writeText(team2.id);
                  e.stopPropagation();
                }
              }}
            />
            {(isFinished && spoil && winner) &&
              <p className={'wl ' + (team2.id === winner.id ? "V" : "D")}>{team2.id === winner.id ? "WIN" : "LOSE"}</p>
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