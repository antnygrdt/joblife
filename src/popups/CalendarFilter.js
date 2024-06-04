import React from 'react';
import Popup from '../components/Popup';
import '../styles/popups/CalendarFilters.scss'

const CalendarFilter = ({ setOpen, filters, options, setFilters }) => {
    return (
        <Popup
            header="Filtrer le calendrier"
            setOpen={setOpen}
            body={
                <div className='filtersForm'>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        const order = event.target.elements[0].value;
                        const games = event.target.elements[1].value;
                        const leagues = event.target.elements[2].value;
                        const years = event.target.elements[3].value;

                        setFilters({ order, games, leagues, years });
                        setOpen(false);
                    }}>
                        <label>
                            Trier par:
                            <select defaultValue={filters.order} required>
                                <option value="asc">Les plus récents</option>
                                <option value="desc">Les plus anciens</option>
                            </select>
                        </label>
                        <label>
                            Sélectionner un jeu:
                            <select defaultValue={filters.games} required>
                                {options.games.map((game, index) => (
                                    <option key={`game-${index}`} value={game}>{game}</option>
                                ))}
                                <option value="all">Tout les jeux</option>
                            </select>
                        </label>
                        <label>
                            Sélectionner une ligue:
                            <select defaultValue={filters.leagues} required>
                                {options.leagues.map((league, index) => (
                                    <option key={`league-${index}`} value={league}>{league}</option>
                                ))}
                                <option value="all">Toutes les ligues</option>
                            </select>
                        </label>
                        <label>
                            Sélectionner une année:
                            <select defaultValue={filters.years} required>
                                {options.years.map((year, index) => (
                                    <option key={`league-${index}`} value={year}>{year}</option>
                                ))}
                                <option value="all">Toutes les années</option>
                            </select>
                        </label>
                        <br />
                        <input type="submit" value="Valider" />
                        <button onClick={() => setOpen(false)}>Annuler</button>
                    </form>
                </div>
            }
        />
    );
};

export default CalendarFilter;