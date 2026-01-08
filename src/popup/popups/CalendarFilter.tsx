import Popup from '../components/Popup';
import '../styles/popups/CalendarFilters.scss';
import { CalendarFilters, FiltersOptions } from '../interfaces';

interface CalendarFilterProps {
  setOpen: (open: boolean) => void;
  filters: CalendarFilters;
  options: FiltersOptions;
  setFilters: (filters: CalendarFilters) => void;
}

const CalendarFilter = ({ setOpen, filters, options, setFilters }: CalendarFilterProps) => {
  return (
    <Popup
      header="Filtrer le calendrier"
      setOpen={setOpen}
      body={
        <div className='filtersForm'>
          <form onSubmit={(event) => {
            event.preventDefault();
            const formElements = event.currentTarget.elements as HTMLFormControlsCollection;
            const order = (formElements[0] as HTMLSelectElement).value;
            const games = (formElements[1] as HTMLSelectElement).value;
            const leagues = (formElements[2] as HTMLSelectElement).value;
            const years = (formElements[3] as HTMLSelectElement).value;

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
                  <option key={`year-${index}`} value={year}>{year}</option>
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