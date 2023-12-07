import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import BottomBar from './components/BottomBar'
import UpperBar from './components/UpperBar';
import Settings from './components/Settings';

import "./styles/index.scss";
import Welcome from './components/Welcome';
import EasterEgg from './components/EasterEgg';
import Rosters from './pages/Rosters';

const Calendar = lazy(() => import('./pages/Calendar'));
const Twitch = lazy(() => import('./pages/Twitch'));
const Youtube = lazy(() => import('./pages/Youtube'));

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('JOBLIFE_WELCOME', (result) => {
      if (result.JOBLIFE_WELCOME === undefined) {
        setWelcomeOpen(true);
        chrome.storage.local.set({
          JOBLIFE_WELCOME: true
        });
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <div>
        <UpperBar setSettingsOpen={setSettingsOpen} setEasterEggOpen={setEasterEggOpen} />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/twitch" element={<Twitch />} />
            <Route path="/youtube" element={<Youtube />} />
            <Route path="/rosters" element={<Rosters />} />

            <Route path="*" element={<Calendar />} />
          </Routes>
        </Suspense>
        <BottomBar />
        {settingsOpen && <Settings setOpenSettings={setSettingsOpen} />}
        {easterEggOpen && <EasterEgg setEasterEggOpen={setEasterEggOpen} />}
        {welcomeOpen && <Welcome setOpenWelcome={setWelcomeOpen} />}
      </div>
    </BrowserRouter>
  );
}

export default App;
