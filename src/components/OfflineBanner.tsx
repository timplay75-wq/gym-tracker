import { useLanguage } from '@/i18n';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getQueueLength } from '@/services/offlineQueue';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineBanner() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const { t } = useLanguage();
  const queueLen = getQueueLength();

  if (isOnline && !wasOffline) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-2 px-4 py-2 text-white text-xs font-medium transition-colors duration-300 ${
        isOnline ? 'bg-[#22c55e]' : 'bg-[#ef4444]'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span>{t.offline?.syncing || 'Онлайн. Синхронизация...'}</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5" />
          <span>
            {t.offline?.noConnection || 'Нет соединения'}
            {queueLen > 0 && ` • ${queueLen} ${t.offline?.pending || 'в очереди'}`}
          </span>
        </>
      )}
    </div>
  );
}
