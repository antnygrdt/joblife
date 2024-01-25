import React, { useEffect, useState } from 'react';

import Match from '../components/Match';

const Calendar = () => {

    const [matchData, setMatchData] = useState([])
    const [teamData, setTeamData] = useState([])

    const maxMatchs = 30;
    const [isUnrolled, setIsUnrolled] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    const [page, setPageState] = useState("coming")
    const [transition, setTransition] = useState(false);
    const [translateY, setTranslateY] = useState(0);

    function setPage(newPage) {
        if (page !== newPage) {
            animate();
        }

        setPageState(newPage);
    }

    const animate = () => {
        setTranslateY(500);
        setTimeout(() => {
            setTransition(true);
            setTranslateY(0);
            setTimeout(() => {
                setTransition(false);
            }, 300);
        }, 10)
    };

    useEffect(() => {
        chrome.storage.local.get(['JOBLIFE_MATCHES', 'JOBLIFE_TEAMS'], (result) => {
            if (result.JOBLIFE_MATCHES !== undefined) {
                setMatchData(result.JOBLIFE_MATCHES);
            }

            if (result.JOBLIFE_TEAMS !== undefined) {
                setTeamData(result.JOBLIFE_TEAMS);
            }

            setTimeout(() => setFadeIn(true), 50);
        });
    }, [])

    if (matchData.length === 0 || teamData.length === 0) return;

    const matchs = matchData.map(match => ({
        ...match,
        team1: teamData.find(team => team.id === match.team1),
        team2: teamData.find(team => team.id === match.team2)
    })).filter((match) => (match.status === "finished" && page === "finished") || (match.status !== "finished" && page === "coming"));

    const matchList = isUnrolled ? matchs : matchs.reverse().slice(0, maxMatchs);

    return (
        <div>
            <div className={`fade-in${fadeIn ? ' active' : ''}`}>
                <div className='calendar-page'>
                    <button onClick={() => setPage("coming")} className={"page-button " + (page === "coming" ? "selected" : "")}>
                        À venir
                    </button>
                    <button onClick={() => setPage("finished")} className={"page-button " + (page === "finished" ? "selected" : "")}>
                        Terminé
                    </button>

                    <div className={'transition' + (transition ? ' active' : '')} style={{ transform: `translateY(${translateY}px)` }}>
                        {matchs.length === 0 ?

                            <p className='no-match-found'>Aucun match n'a été trouvé</p> :

                            <div className="matchs">
                                <div className={'match-list'}>
                                    {Object.values(matchList)
                                        .sort((a, b) => {
                                            const dateA = new Date(a.scheduled_at);
                                            const dateB = new Date(b.scheduled_at);

                                            return (page === "finished") ? (dateB - dateA) : (dateA - dateB);
                                        })
                                        .map((match) => (
                                            <li key={match.id}>
                                                <Match match={match} />
                                            </li>
                                        ))
                                    }
                                    {!isUnrolled && page == "finished" &&
                                        <button onClick={() => setIsUnrolled(true)}>Afficher tous les matchs</button>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Calendar;