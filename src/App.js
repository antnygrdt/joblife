import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import BottomBar from './components/BottomBar'
import UpperBar from './components/UpperBar';
import Settings from './popups/Settings';

import "./styles/index.scss";
import Welcome from './popups/Welcome';
import EasterEgg from './popups/EasterEgg';
import Rosters from './pages/Rosters';
import Update from './popups/Update';

import { compareVersions } from './Utils';
import NewNotification from './popups/NewNotification';
import Notes from './popups/Notes';

const Calendar = lazy(() => import('./pages/Calendar'));
const Twitch = lazy(() => import('./pages/Twitch'));
const Youtube = lazy(() => import('./pages/Youtube'));

function App() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [updates, setUpdates] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [notifcationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentNotifications, setCurrentNotifications] = useState([]);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(window.navigator.onLine);

    window.addEventListener('offline', updateOnlineStatus);
    window.addEventListener('online', updateOnlineStatus);

    return () => {
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('online', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      document.body.style.height = '300px';

    } else {
      document.body.style.height = '750px';

      chrome.storage.local.get(['JOBLIFE_WELCOME', 'JOBLIFE_VERSION'], (result) => {
        if (result.JOBLIFE_WELCOME === undefined) {
          setWelcomeOpen(true);
          chrome.storage.local.set({
            JOBLIFE_WELCOME: true
          });
        }

        fetch('https://api.asakicorp.com/joblife/updates')
          .then(response => response.json())
          .then(data => {
            setUpdates(data);

            const lastVersion = result.JOBLIFE_VERSION;
            const currentVersion = chrome.runtime.getManifest().version;
            if (lastVersion !== undefined && lastVersion !== currentVersion && compareVersions(currentVersion, lastVersion) === 1) {
              setUpdateOpen(true);
            }

            chrome.storage.local.set({ 'JOBLIFE_VERSION': currentVersion });
          });
      });

      getNotifications(setNotifications).then(n => {
        if (n.length > 0) {
          setCurrentNotifications(n);
          setNotificationOpen(true);
        }
      });
    }
  }, [isOnline]);

  window.addEventListener('offline', () => setIsOnline(false));
  window.addEventListener('online', () => setIsOnline(true));

  if (!isOnline) {
    return (
      <div className='no-connection' style={{ height: '250px' }}>
        <h1>Joblife</h1>
        <h2>Tu ne sembles pas connecté à Internet</h2>
        <h3>Cette extension nécessite une connexion à internet pour fonctionner.</h3>
      </div>
    );
  } else return (
    <BrowserRouter>
      <div>
        <UpperBar setSettingsOpen={setSettingsOpen} setNotesOpen={setNotesOpen} setEasterEggOpen={setEasterEggOpen} />
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

        {notifcationOpen && <NewNotification setOpen={setNotificationOpen} notifications={currentNotifications} />}
        {updateOpen && <Update setUpdateOpen={setUpdateOpen} updates={updates} />}
        {welcomeOpen && <Welcome setOpenWelcome={setWelcomeOpen} />}
        {easterEggOpen && <EasterEgg setEasterEggOpen={setEasterEggOpen} />}
        {notesOpen && <Notes setOpen={setNotesOpen} updates={updates} notifications={notifications} />}
        {settingsOpen && <Settings setOpenSettings={setSettingsOpen} />}
      </div>
    </BrowserRouter>
  );
}

async function getNotifications(setNotifications) {
  return new Promise((resolve, reject) => {
    var notifications = [];
    chrome.storage.local.get(['JOBLIFE_NOTIFICATIONS'], async (result) => {
      if (result.JOBLIFE_NOTIFICATIONS !== undefined) {
        var entries = Object.entries(result.JOBLIFE_NOTIFICATIONS);
        setNotifications(entries);

        await Promise.all(entries.map(([key, value]) => {
          return new Promise((resolve, reject) => {
            chrome.storage.local.get('JOBLIFE_NOTIF_' + key, (result) => {
              if (result['JOBLIFE_NOTIF_' + key] === undefined && new Date(value.until) > Date.now()) {
                notifications.push(value);

                chrome.storage.local.set({
                  ['JOBLIFE_NOTIF_' + key]: true
                });
              }
              resolve();
            });
          });
        }));
      }
      resolve(notifications);
    });
  });
}

export default App;
