import Pusher from 'pusher-js';

let pusherInstance = null;

export const getPusher = () => {
  if (!pusherInstance) {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    
    pusherInstance = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true,
      authEndpoint: `${apiUrl}/pusher/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    });

    // Enable logging in development
    if (import.meta.env.DEV) {
      Pusher.logToConsole = true;
    }
  }

  return pusherInstance;
};

// Update auth token (call after login)
export const updatePusherAuth = () => {
  if (pusherInstance) {
    const token = localStorage.getItem('token');
    pusherInstance.config.auth.headers.Authorization = `Bearer ${token}`;
  }
};

export const subscribeToTicket = (ticketId, user, callbacks) => {
  const pusher = getPusher();
  const channelName = `presence-ticket.${ticketId}`;
  
  // Unsubscribe first if already subscribed to avoid duplicates
  const existingChannel = pusher.channel(channelName);
  if (existingChannel) {
    existingChannel.unbind_all();
    pusher.unsubscribe(channelName);
  }

  const channel = pusher.subscribe(channelName);
  let isSubscribed = false;

  // Track subscription state
  channel.bind('pusher:subscription_succeeded', (members) => {
    isSubscribed = true;
    
    if (callbacks.onPresenceUpdate) {
      const activeUsers = [];
      members.each((member) => {
        if (member.id !== user?.id) {
          activeUsers.push(member.info);
        }
      });
      callbacks.onPresenceUpdate(activeUsers);
    }
  });

  channel.bind('pusher:subscription_error', (error) => {
    console.error('Subscription error:', error);
    isSubscribed = false;
  });

  // Listen for new messages
  if (callbacks.onMessage) {
    channel.bind('App\\Events\\MessageSent', (data) => {
      callbacks.onMessage(data.message);
    });
  }

  // Listen for message updates
  if (callbacks.onMessageUpdate) {
    channel.bind('App\\Events\\MessageUpdated', (data) => {
      callbacks.onMessageUpdate(data.message);
    });
  }

  // Listen for message deletes
  if (callbacks.onMessageDelete) {
    channel.bind('App\\Events\\MessageDeleted', (data) => {
      callbacks.onMessageDelete(data.message_id);
    });
  }

  // Listen for ticket updates
  if (callbacks.onTicketUpdate) {
    channel.bind('App\\Events\\TicketUpdated', (data) => {
      callbacks.onTicketUpdate(data.ticket);
    });
  }

  // Listen for typing events (client events)
  if (callbacks.onTyping) {
    channel.bind('client-typing', (data) => {
      callbacks.onTyping(data);
    });
  }

  // Presence events
  if (callbacks.onMemberJoined) {
    channel.bind('pusher:member_added', (member) => {
      if (member.id !== user?.id) {
        callbacks.onMemberJoined(member.info);
      }
    });
  }

  if (callbacks.onMemberLeft) {
    channel.bind('pusher:member_removed', (member) => {
      callbacks.onMemberLeft(member.info);
    });
  }

  // Safe trigger for client events - only when subscribed
  const safeTrigger = (eventName, data) => {
    if (isSubscribed && channel.subscribed) {
      try {
        channel.trigger(eventName, data);
      } catch {
        // Client events may not be enabled in Pusher dashboard
      }
    }
  };

  return {
    channel,
    isSubscribed: () => isSubscribed,
    unsubscribe: () => {
      isSubscribed = false;
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    },
    triggerTyping: (userData) => {
      safeTrigger('client-typing', {
        user_id: userData.id,
        user_name: userData.full_name,
        typing: true,
      });
    },
    triggerStopTyping: (userData) => {
      safeTrigger('client-typing', {
        user_id: userData.id,
        user_name: userData.full_name,
        typing: false,
      });
    },
  };
};

// Subscribe to user's private channel for notifications
export const subscribeToUserNotifications = (userId, callbacks) => {
  const pusher = getPusher();
  const channelName = `private-user.${userId}`;
  
  // Unsubscribe first if already subscribed
  const existingChannel = pusher.channel(channelName);
  if (existingChannel) {
    existingChannel.unbind_all();
    pusher.unsubscribe(channelName);
  }

  const channel = pusher.subscribe(channelName);

  // Handle subscription success
  channel.bind('pusher:subscription_succeeded', () => {
    console.log('Subscribed to notifications channel');
  });

  channel.bind('pusher:subscription_error', (error) => {
    console.error('Notification subscription error:', error);
  });

  // New message notification
  if (callbacks.onNewMessage) {
    channel.bind('App\\Events\\NewMessageNotification', (data) => {
      callbacks.onNewMessage(data);
    });
  }

  // Ticket assigned notification
  if (callbacks.onTicketAssigned) {
    channel.bind('App\\Events\\TicketAssigned', (data) => {
      callbacks.onTicketAssigned(data);
    });
  }

  // Ticket updated notification
  if (callbacks.onTicketUpdated) {
    channel.bind('App\\Events\\TicketUpdated', (data) => {
      callbacks.onTicketUpdated(data);
    });
  }

  return {
    channel,
    unsubscribe: () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    },
  };
};

export const disconnectPusher = () => {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
};

export default {
  getPusher,
  updatePusherAuth,
  subscribeToTicket,
  subscribeToUserNotifications,
  disconnectPusher,
};
