import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import BottomBar from './components/BottomBar';
import UpperBar from './components/UpperBar';
import Settings from './popups/Settings';

import Rosters from './pages/Rosters';
import EasterEgg from './popups/EasterEgg';
import Update from './popups/Update';
import Welcome from './popups/Welcome';
import "./styles/index.scss";

import { compareVersions, fetchAPI } from './Utils';
import Details from './pages/Details';
import NewNotification from './popups/NewNotification';
import Notes from './popups/Notes';
import Loading from './components/Loading';

const Calendar = lazy(() => import('./pages/Calendar'));
const Twitch = lazy(() => import('./pages/Twitch'));
const Youtube = lazy(() => import('./pages/Youtube'));

function App() {
  const [isOnline, setIsOnline] = useState(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [updates, setUpdates] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [notifcationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentNotifications, setCurrentNotifications] = useState([]);

  const [showAppLoading, setShowAppLoading] = useState(false);

  function checkInternet() {
    fetch('https://www.google.com', { method: 'HEAD', mode: 'no-cors' })
      .then(() => {
        setIsOnline(true);
      })
      .catch(() => {
        setIsOnline(false);
      });
  }

  useEffect(() => {
    fetchAPI('popup');

    checkInternet();

    setInterval(() => {
      checkInternet();
    }, 5000 * 3);
  }, []);

  useEffect(() => {
    if (isOnline === null) {
      document.body.style.height = '600px';

    } else if (!isOnline) {
      document.body.style.height = '350px';

    } else {
      document.body.style.height = '600px';

      chrome.storage.local.get(['JOBLIFE_WELCOME', 'JOBLIFE_VERSION'], (result) => {
        if (result.JOBLIFE_WELCOME === undefined) {
          setWelcomeOpen(true);
          chrome.storage.local.set({
            JOBLIFE_WELCOME: true
          });
        }

        fetchAPI('updates')
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

    setTimeout(() => {
      setShowAppLoading(true);
    }, 500);
  }, [isOnline]);

  if (isOnline === null) {
    // if (!showAppLoading) return null;

    return (
      <div className='app-loading'>
        <img src="assets/Joblife-Logo.png" alt="JobLife" />
        <Loading />
      </div>
    )
  } else if (!isOnline) {
    return (
      <div className='no-connection' style={{ height: '350px' }}>
        <div className='main'>
          <div className='icons'>
            <img src="assets/icones/no-connection.png" alt="Pas de connexion" />
          </div>
          <h1>OOPS!</h1>
          <h2>Connexion internet lente ou inexistante</h2>
          <h3>Une connexion internet est nécessaire pour utiliser l'extension</h3>

          <button onClick={() => checkInternet()}>Réessayer</button>
        </div>

        <div className='footer'>
          <p>Si vous n'arrivez pas à résoudre ce problème, contactez <a href="https://x.com/tsuyobnha" target='_blank'>@tsuyobnha</a> sur X.</p>
        </div>
      </div>
    );
  } else return (
    <BrowserRouter>
      <UpperBar setSettingsOpen={setSettingsOpen} setNotesOpen={setNotesOpen} setEasterEggOpen={setEasterEggOpen} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/twitch" element={<Twitch />} />
          <Route path="/youtube" element={<Youtube />} />
          <Route path="/rosters" element={<Rosters />} />
          <Route path="/details" element={<Details />} />

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