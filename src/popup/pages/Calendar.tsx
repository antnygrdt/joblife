import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Match, Team, CalendarFilters, FiltersOptions } from '../interfaces';
import MatchComponent from '../components/Match';
import CalendarFilter from '../popups/CalendarFilter';

const Calendar = () => {
  const [matchData, setMatchData] = useState<Match[]>([]);
  const [teamData, setTeamData] = useState<Team[]>([]);

  const maxMatchs = 30;
  const [isUnrolled, setIsUnrolled] = useState(false);

  const [page, setPageState] = useState<"coming" | "finished">("coming");
  const fadeKey = useRef(0);

  const [spoil, setSpoilData] = useState(false);
  const [noMatchInfo, setNoMatchInfo] = useState<Array<{ icon: string; message: string }>>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<CalendarFilters>({ 'order': 'asc', 'games': 'all', 'leagues': 'all', 'years': 'all' });
  const [filtersOptions, setFiltersOptions] = useState<FiltersOptions | null>(null);

  const location = useLocation();
  const state = location.state as { id?: string; finished?: boolean; filters?: CalendarFilters; isUnrolled?: boolean } | null;

  function setPage(newPage: "coming" | "finished") {
    if (newPage !== page) {
      fadeKey.current += 1;
    }
    setPageState(newPage);
  }

  useEffect(() => {
    const getPropertyValues = (arr: any[], propName: string) => [...new Set(arr.map(obj => obj[propName]))];

    chrome.storage.local.get(['JOBLIFE_MATCHES', 'JOBLIFE_TEAMS', 'JOBLIFE_SPOIL', 'JOBLIFE_NOMATCHINFO'], (result) => {
      if (result.JOBLIFE_MATCHES !== undefined) {
        const matches = result.JOBLIFE_MATCHES as Match[];
        const games = getPropertyValues(matches, 'game');
        const leagues = getPropertyValues(matches, 'league_slug');
        const years = [...new Set(matches.map(obj => new Date(obj.scheduled_at).getFullYear()))];

        const filtersOptions: FiltersOptions = { games, leagues, years };
        setFiltersOptions(filtersOptions);

        setMatchData(matches);
      }

      if (result.JOBLIFE_TEAMS !== undefined) {
        setTeamData(result.JOBLIFE_TEAMS as Team[]);
      }

      if (result.JOBLIFE_SPOIL !== undefined && result.JOBLIFE_SPOIL !== null) {
        setSpoilData(result.JOBLIFE_SPOIL as boolean);
      }

      if (result.JOBLIFE_NOMATCHINFO !== undefined && result.JOBLIFE_NOMATCHINFO !== null) {
        setNoMatchInfo(result.JOBLIFE_NOMATCHINFO as Array<{ icon: string; message: string }>);
      }
    });

    if (state && state.id) {
      setPage(state.finished ? "finished" : "coming");
      if (state.filters) {
        setFilters(state.filters);
      }
      if (state.isUnrolled !== undefined) {
        setIsUnrolled(state.isUnrolled);
      }
      setTimeout(() => {
        var matchElement = document.getElementById(state.id!);
        if (matchElement) {
          matchElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
          });
        }
      }, 100);
    }
  }, [])

  function setSpoil(spoil: boolean) {
    setSpoilData(spoil);
    chrome.storage.local.set({
      JOBLIFE_SPOIL: spoil
    });
  }

  if (matchData.length === 0 || teamData.length === 0) return null;

  const matchs = matchData.map(match => ({
    ...match,
    team1: teamData.find(team => team.id === match.team1) as Team,
    team2: teamData.find(team => team.id === match.team2) as Team
  })).filter((match) => (match.status === "finished" && page === "finished") || (match.status !== "finished" && page === "coming")
  ).filter((match) => (filters.games === 'all' || match.game === filters.games)
  ).filter((match) => (filters.leagues === 'all' || match.league_slug === filters.leagues)
  ).filter((match) => (filters.years === 'all' || new Date(match.scheduled_at).getFullYear() === parseInt(filters.years)));

  const upcomingMatchs = matchData.filter(match => match.status !== "finished");

  const matchList = isUnrolled ? matchs : filters.order === 'asc' ? matchs.reverse().slice(0, maxMatchs) : matchs.slice(0, maxMatchs);

  return (
    <>
      {openFilter && filtersOptions && <CalendarFilter setOpen={setOpenFilter} filters={filters} options={filtersOptions} setFilters={setFilters} />}
      <div>
        <div className='calendar-page'>
          <div className='buttons'>
            {matchs.length > 0 &&
              <button className={`switch ${spoil ? 'on' : 'off'}`} title={`Spoils: ${spoil ? 'Affichés' : 'Cachés'}`} onClick={() => setSpoil(!spoil)}>
                <img src={`/assets/icones/${spoil ? 'eye' : 'eye2'}.png`} alt="Spoil" />
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
                <img src="/assets/icones/filter.png" alt="Filtre" />
              </button>
            }
          </div>

          <div className={'fade-in'} key={fadeKey.current}>
            <div className={'calendar-container scroll-bar'}>
              {matchs.length === 0 ? <p className='no-match-found'>Aucun match n'a été trouvé</p> :
                <div className="match-list">
                  {Object.values(matchList)
                    .sort((a, b) => {
                      if (isNaN(new Date(a.scheduled_at).getTime())) return 1;
                      if (isNaN(new Date(b.scheduled_at).getTime())) return -1;

                      const dateA = new Date(a.scheduled_at);
                      const dateB = new Date(b.scheduled_at);

                      return (page === "finished") ? (filters.order === 'asc' ? (dateB.getTime() - dateA.getTime()) : (dateA.getTime() - dateB.getTime())) : (dateA.getTime() - dateB.getTime());
                    })
                    .map((match) => (
                      <li key={match.id}>
                        <MatchComponent match={match} spoil={spoil} isUnrolled={state && state.id === match.id ? true : false} isCalendarUnrolled={isUnrolled} calendarFilters={filters} />
                      </li>
                    ))
                  }
                </div>
              }

              {page === "coming" &&
                <div className='noMatchInfo'>
                  {noMatchInfo.length > 0 && noMatchInfo.map((item, index) => (
                    <div className='noMatchInfo__item' key={index}>
                      <img src={item.icon} alt="Icon" />
                      <p>{item.message}</p>
                    </div>
                  ))}
                </div>}

              {(!isUnrolled && page == "finished" && matchList.length === maxMatchs) &&
                <button style={{ marginBottom: '2px' }} className="show-more-button" onClick={() => setIsUnrolled(true)}>Afficher tous les matchs</button>
              }

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;