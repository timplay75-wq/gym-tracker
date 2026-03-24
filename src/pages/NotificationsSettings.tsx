import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/useToast';

export const NotificationsSettings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const nt = t.notifSettings;

  const { permission, settings, requestPermission, saveSettings, showNotification } =
    useNotifications();
  const toast = useToast();
  const [requesting, setRequesting] = useState(false);

  const handleEnableToggle = async () => {
    if (permission === 'denied') return;
    if (permission === 'default') {
      setRequesting(true);
      const result = await requestPermission();
      setRequesting(false);
      if (result !== 'granted') return;
    }
    saveSettings({ enabled: !settings.enabled });
    toast.success(nt.saved);
  };

  const handleDayToggle = (day: number) => {
    const next = settings.days.includes(day)
      ? settings.days.filter(d => d !== day)
      : [...settings.days, day].sort((a, b) => a - b);
    saveSettings({ days: next });
  };

  const handleTimeChange = (value: string) => {
    saveSettings({ reminderTime: value });
  };

  const handleTest = () => {
    showNotification(nt.testTitle, nt.testBody);
  };

  const permissionBlocked = permission === 'denied';

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e]">
      <div className="max-w-[480px] mx-auto px-4">
        {/* Header */}
        <header className="pt-6 pb-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{nt.title}</h1>
        </header>

        {/* Main settings card */}
        <div className="bg-white dark:bg-[#16213e] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-4">
          {/* Enable toggle */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{nt.enable}</span>
            <button
              onClick={handleEnableToggle}
              disabled={permissionBlocked || requesting}
              className={`w-12 h-7 rounded-full transition-colors relative disabled:opacity-40 ${
                settings.enabled && permission === 'granted' ? 'bg-[#9333ea]' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                  settings.enabled && permission === 'granted' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reminder time */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{nt.reminderTime}</span>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={e => handleTimeChange(e.target.value)}
              disabled={!settings.enabled || permission !== 'granted'}
              className="text-sm font-semibold text-[#9333ea] bg-transparent border-none outline-none disabled:opacity-40 cursor-pointer"
            />
          </div>

          {/* Days of week */}
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{nt.days}</p>
            <div className="flex gap-2 justify-between">
              {nt.dayNames.map((name, idx) => {
                const active = settings.days.includes(idx);
                const disabled = !settings.enabled || permission !== 'granted';
                return (
                  <button
                    key={idx}
                    onClick={() => !disabled && handleDayToggle(idx)}
                    disabled={disabled}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors disabled:opacity-40 ${
                      active
                        ? 'bg-[#9333ea] text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Test button */}
        {permission === 'granted' && (
          <button
            onClick={handleTest}
            className="w-full py-3.5 bg-[#9333ea] text-white rounded-2xl font-semibold text-sm active:bg-[#7c3aed] transition-colors"
          >
            {nt.testBtn}
          </button>
        )}
      </div>
    </div>
  );
};
