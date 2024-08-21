import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Match from '../components/Match';
import CalendarFilter from '../popups/CalendarFilter';

const Calendar = () => {

  const [matchData, setMatchData] = useState([])
  const [teamData, setTeamData] = useState([])

  const maxMatchs = 30;
  const [isUnrolled, setIsUnrolled] = useState(false);

  const [page, setPageState] = useState("coming");
  const fadeKey = useRef(0);

  const [spoil, setSpoilData] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({ 'order': 'asc', 'games': 'all', 'leagues': 'all', 'years': 'all' });
  const [filtersOptions, setFiltersOptions] = useState(null);

  const location = useLocation();
  const state = location.state;

  function setPage(newPage) {
    if (newPage !== page) {
      fadeKey.current += 1;
    }

    setPageState(newPage);
  }

  useEffect(() => {
    const getPropertyValues = (arr, propName) => [...new Set(arr.map(obj => obj[propName]))];

    chrome.storage.local.get(['JOBLIFE_MATCHES', 'JOBLIFE_TEAMS', 'JOBLIFE_SPOIL'], (result) => {
      if (result.JOBLIFE_MATCHES !== undefined) {
        const matches = result.JOBLIFE_MATCHES;
        const games = getPropertyValues(matches, 'game');
        const leagues = getPropertyValues(matches, 'league_slug');
        const years = [...new Set(matches.map(obj => new Date(obj.scheduled_at).getFullYear()))]

        const filtersOptions = { games, leagues, years };
        setFiltersOptions(filtersOptions);

        setMatchData(matches);
      }

      if (result.JOBLIFE_TEAMS !== undefined) {
        setTeamData(result.JOBLIFE_TEAMS);
      }

      if (result.JOBLIFE_SPOIL !== undefined) {
        setSpoil(result.JOBLIFE_SPOIL);
      }
    });

    if (state && state.id) {
      setPage("finished");
      setFilters(state.filters);
      setIsUnrolled(state.isUnrolled);
      setTimeout(() => {
        var matchElement = document.getElementById(state.id);

        matchElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }, 100);
    }
  }, [])

  function setSpoil(spoil) {
    setSpoilData(spoil);
    chrome.storage.local.set({
      JOBLIFE_SPOIL: spoil
    });
  }

  if (matchData.length === 0 || teamData.length === 0) return;

  const matchs = matchData.map(match => ({
    ...match,
    team1: teamData.find(team => team.id === match.team1),
    team2: teamData.find(team => team.id === match.team2)
  })
  ).filter((match) => (match.status === "finished" && page === "finished") || (match.status !== "finished" && page === "coming")
  ).filter((match) => (filters.games === 'all' || match.game === filters.games)
  ).filter((match) => (filters.leagues === 'all' || match.league_slug === filters.leagues)
  ).filter((match) => (filters.years === 'all' || new Date(match.scheduled_at).getFullYear() === parseInt(filters.years)));

  const upcomingMatchs = matchData.filter(match => match.status !== "finished");

  const matchList = isUnrolled ? matchs : filters.order === 'asc' ? matchs.reverse().slice(0, maxMatchs) : matchs.slice(0, maxMatchs);

  return (
    <>
      {openFilter && <CalendarFilter setOpen={setOpenFilter} filters={filters} options={filtersOptions} setFilters={setFilters} />}
      <div>
        <div className='calendar-page'>
          <div className='buttons'>
            {matchs.length > 0 &&
              <button className={`switch ${spoil ? 'on' : 'off'}`} title={`Spoils: ${spoil ? 'Affichés' : 'Cachés'}`} onClick={() => setSpoil(!spoil)}>
                <img src={`assets/icones/${spoil ? 'eye' : 'eye2'}.png`} alt="Spoil" />
              </button>
            }
            <div className='page-button'>
              <button onClick={() => setPage("coming")} className={(page === "coming" ? "selected" : "")}>
                À venir
              </button>
              <button onClick={() => setPage("finished")} className={(page === "finished" ? "selected" : "")}>
                Terminé
              </button>
            </div>
            {(page === "finished" || upcomingMatchs.length > 0) &&
              <button title='Filtrer' onClick={() => { setOpenFilter(true) }} className='filter'>
                <img src="assets/icones/filter.png" alt="Filtre" />
              </button>
            }
          </div>

          <div className={'fade-in'} key={fadeKey.current}>
            {matchs.length === 0 ?

              <p className='no-match-found'>Aucun match n'a été trouvé</p> :

              <div className={'match-list scroll-bar'}>
                {Object.values(matchList)
                  .sort((a, b) => {
                    const dateA = new Date(a.scheduled_at);
                    const dateB = new Date(b.scheduled_at);

                    return (page === "finished") ? (filters.order === 'asc' ? (dateB - dateA) : (dateA - dateB)) : (dateA - dateB);
                  })
                  .map((match) => (
                    <li key={match.id}>
                      <Match match={match} spoil={spoil} isUnrolled={state && state.id === match.id ? true : false} isCalendarUnrolled={isUnrolled} calendarFilters={filters} />
                    </li>
                  ))
                }
                {(!isUnrolled && page == "finished" && matchList.length === maxMatchs) &&
                  <button style={{ marginBottom: '2px' }} className="show-more-button" onClick={() => setIsUnrolled(true)}>Afficher tous les matchs</button>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;