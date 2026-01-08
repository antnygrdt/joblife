import { useState } from 'react';
import Popup from '../components/Popup';
import { parseTextWithUrls } from '../Utils';
import '../styles/popups/NewNotification.scss';
import { Notification } from '../interfaces';

interface NewNotificationProps {
  setOpen: (open: boolean) => void;
  notifications: Notification[];
}

const NewNotification = ({ setOpen, notifications }: NewNotificationProps) => {
  const [currentNotification, setCurrentNotification] = useState(0);

  function updateCurrentNotification(add: boolean) {
    if (add && currentNotification < notifications.length - 1) {
      setCurrentNotification(currentNotification + 1);
    } else if (!add && currentNotification > 0) {
      setCurrentNotification(currentNotification - 1);
    }
  }

  return (
    <div className='newNotifications'>
      <Popup
        header={
          <div className='heading'>
            {notifications.length > 1 && <h2>{`${currentNotification + 1}/${notifications.length}`}</h2>}
            {notifications.length > 1 && <button disabled={currentNotification === 0} onClick={() => updateCurrentNotification(false)}> <i className='arrow left'></i> </button>}
            <h1>{notifications[currentNotification].title}</h1>
            {notifications.length > 1 && <button disabled={currentNotification === notifications.length - 1} onClick={() => updateCurrentNotification(true)}> <i className='arrow right'></i> </button>}
          </div>
        }
        setOpen={setOpen}
        body={
          <p className='notification-message'>{parseTextWithUrls(notifications[currentNotification].message)}</p>
        }
      />
    </div>
  );
};

export default NewNotification;
