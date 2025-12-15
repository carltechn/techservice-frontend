import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { NotificationContext, AuthContext } from './contexts';
import { subscribeToUserNotifications, disconnectPusher } from '../services/pusher';

export const NotificationProvider = ({ children }) => {
  // Use AuthContext directly to avoid the hook's error throwing
  const auth = useContext(AuthContext);
  const user = auth?.user;
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      read: false,
      timestamp: new Date(),
    };
    
    setNotifications((prev) => [newNotification, ...prev].slice(0, 50));
    setUnreadCount((prev) => prev + 1);

    return id;
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Subscribe to user notifications when logged in
  useEffect(() => {
    if (!user?.id) return;

    let subscription;
    try {
      subscription = subscribeToUserNotifications(user.id, {
        onNewMessage: (data) => {
          addNotification({
            type: 'message',
            title: 'New Message',
            message: `${data.sender_name} sent a message in ticket #${data.ticket_number}`,
            ticketId: data.ticket_id,
            data,
          });
        },
        onTicketAssigned: (data) => {
          addNotification({
            type: 'assignment',
            title: 'Ticket Assigned',
            message: `You have been assigned to ticket #${data.ticket_number}: ${data.title}`,
            ticketId: data.ticket_id,
            data,
          });
        },
        onTicketUpdated: (data) => {
          addNotification({
            type: 'update',
            title: 'Ticket Updated',
            message: `Ticket #${data.ticket_number} status changed to ${data.status}`,
            ticketId: data.ticket_id,
            data,
          });
        },
      });
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user?.id, addNotification]);

  // Disconnect pusher on unmount
  useEffect(() => {
    return () => {
      disconnectPusher();
    };
  }, []);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  }), [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearNotifications]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
