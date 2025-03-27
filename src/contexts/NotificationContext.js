// contexts/NotificationContext.js - Notifications context
import { createContext } from 'react';

const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {}
});

export default NotificationContext;