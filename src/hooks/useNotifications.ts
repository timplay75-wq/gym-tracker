import { useState, useCallback } from 'react';

const SETTINGS_KEY = 'gym-notif-settings';
const LAST_SHOWN_KEY = 'gym-notif-last-shown';

export interface NotifSettings {
  enabled: boolean;
  reminderTime: string; // "HH:MM"
  days: number[]; // 0=Sun, 1=Mon ... 6=Sat
}

const DEFAULT_SETTINGS: NotifSettings = {
  enabled: false,
  reminderTime: '09:00',
  days: [1, 2, 3, 4, 5], // Mon–Fri
};

function loadSettings(): NotifSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const [settings, setSettings] = useState<NotifSettings>(loadSettings);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) return 'denied';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const saveSettings = useCallback((patch: Partial<NotifSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const showNotification = useCallback(
    (title: string, body: string) => {
      if (permission !== 'granted') return;
      try {
        new Notification(title, {
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
        });
      } catch {
        /* ignore – unsupported env */
      }
    },
    [permission]
  );

  /** Call on app start: shows reminder if within 5 min of scheduled time */
  const checkAndNotify = useCallback(
    (notifTitle: string, notifBody: string) => {
      if (!settings.enabled || permission !== 'granted') return;
      const now = new Date();
      if (!settings.days.includes(now.getDay())) return;

      const [h, m] = settings.reminderTime.split(':').map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);

      const diffMs = Math.abs(now.getTime() - target.getTime());
      const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
      const alreadyToday =
        lastShown && new Date(lastShown).toDateString() === now.toDateString();

      if (diffMs < 5 * 60 * 1000 && !alreadyToday) {
        showNotification(notifTitle, notifBody);
        localStorage.setItem(LAST_SHOWN_KEY, now.toISOString());
      }
    },
    [settings, permission, showNotification]
  );

  return { permission, settings, requestPermission, saveSettings, showNotification, checkAndNotify };
}
