chrome.runtime.onStartup.addListener(() => {
  console.log(`WORKER STARTUP`);
});

function dp() {
  chrome.storage.local.get('JOBLIFE_PARAMETERS', (result) => {
    const jp = result.JOBLIFE_PARAMETERS;
    var dataToUpdate = {};

    if (jp !== undefined) {
      dataToUpdate = jp;
    }

    const parameters = { LIVE: true, VIDEO: true, MATCH_START: true, MATCH_END: false, GAME_END: false, CUSTOM: true, DEFAULT_PAGE: "calendar" };
    for (const key in parameters) {
      if (jp === undefined || jp[key] === undefined) {
        dataToUpdate[key] = parameters[key];
      }
    }

    chrome.storage.local.set({
      JOBLIFE_PARAMETERS: dataToUpdate
    });
  });
}

function fs() {
  console.log('requests')

  fetch('https://api.asakicorp.com/joblife/constants')
    .then(response => response.json())
    .then(data => {
      chrome.storage.local.set({
        JOBLIFE_SOCIALS: data.socials,
        JOBLIFE_MEMBERS: data.members
      });
    })
    .catch(error => { });

  fetch('https://api.asakicorp.com/joblife/twitch')
    .then(response => response.json())
    .then(data => {
      chrome.storage.local.set({
        JOBLIFE_STREAMERS: data
      });
    })
    .catch(error => { });

  fetch('https://api.asakicorp.com/joblife/youtube')
    .then(response => response.json())
    .then(data => {
      chrome.storage.local.set({
        JOBLIFE_YOUTUBE_VIDEOS: data
      });
    })
    .catch(error => { });

  fetch('https://api.asakicorp.com/joblife/matches')
    .then(response => response.json())
    .then(data => {
      chrome.storage.local.set({
        JOBLIFE_MATCHES: data
      });
    })
    .catch(error => { });

  fetch('https://api.asakicorp.com/joblife/teams')
    .then(response => response.json())
    .then(data => {
      chrome.storage.local.set({
        JOBLIFE_TEAMS: data
      });
    })
    .catch(error => { });

  fetch('https://api.asakicorp.com/joblife/rosters')
    .then(response => response.json())
    .then(data => {
      chrome.storage.local.set({
        JOBLIFE_ROSTERS: data
      });
    })
    .catch(error => { });

  fetch('https://api.asakicorp.com/joblife/standings')
    .then(response => response.json())
    .then(data => {
      chrome.storage.local.set({
        JOBLIFE_STANDINGS: data
      });
    })
    .catch(error => { });

  fetch('https://api.asakicorp.com/joblife/security')
    .then(response => response.json())
    .then(data => {
      chrome.storage.local.set({
        JOBLIFE_SECURITY: data
      });
    })
    .catch(error => { });

  chrome.storage.local.get('LAST_NOTIFICATION', (result) => {
    fetch('https://api.asakicorp.com/joblife/notification')
      .then(response => response.json())
      .then(data => {
        if (result.LAST_NOTIFICATION !== undefined && data !== null && Object.keys(data).length !== 0) {
          if (result.LAST_NOTIFICATION.id !== data.id) {

            const notifId = data.id.split("-")[0];
            chrome.storage.local.get('JOBLIFE_PARAMETERS', (result) => {
              if (result.JOBLIFE_PARAMETERS !== undefined) {
                const jp = result.JOBLIFE_PARAMETERS;
                if (jp[notifId] !== undefined && jp[notifId] === true) {
                  sn(data);
                }
              }
            });
          } else return;
        }

        chrome.storage.local.set({
          LAST_NOTIFICATION: data
        })
      })
      .catch(error => { })
  })

  fetch('https://api.asakicorp.com/joblife/notifications')
    .then(response => response.json())
    .then(data => {
      chrome.storage.local.set({
        JOBLIFE_NOTIFICATIONS: data
      });
    })
    .catch(error => { });
}

function b() {
  chrome.storage.local.get('JOBLIFE_STREAMERS', (result) => {
    const n = result.JOBLIFE_STREAMERS.filter(s => s.isStreaming).length;
    chrome.action.setBadgeText({ text: n.toString() });
    chrome.action.setBadgeTextColor({ color: n > 0 ? "white" : "black" })
    chrome.action.setBadgeBackgroundColor({ color: n > 0 ? "#d66064" : "#D3D3D3" })

    chrome.action.setTitle({ title: n < 1 ? "Aucun joueur en live" : n + " joueur" + (n > 1 ? "s" : "") + " en live" })
  })
}

function sn(notification) {
  chrome.storage.local.get('JOBLIFE_SECURITY', (result) => {
    if (result.JOBLIFE_SECURITY === undefined) return;

    const hasNotification = result.JOBLIFE_SECURITY.notification;
    if (hasNotification) {
      var check = ((Date.now() - notification.timestamp) / 60000) <= 5;
      if (!check) return;

      let details = {
        type: notification.image === undefined ? "basic" : "image",
        iconUrl: notification.icon,
        imageUrl: notification.image || null,
        title: notification.title,
        message: notification.message,
        buttons: [{ title: notification.button.title }],
        priority: 2
      };

      chrome.notifications.create(notification.id, details, function (notificationId) {
        chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
          if (notifId === notificationId && btnIdx === 0) {
            chrome.tabs.create({ url: notification.button.action })
          }
        });
      });
    }
  })
}


setTimeout(dp, 100)
setTimeout(fs, 100)
setTimeout(b, 1e3)

setInterval(b, 15e3)

setInterval(() => {
  fs()
  setTimeout(b, 1e3)
}, 3e4);

chrome.alarms.create("KEEP_ALIVE", {
  delayInMinutes: 1,
  periodInMinutes: 1
})

chrome.alarms.onAlarm.addListener((t => {
  console.log("worker keep alive")
}))