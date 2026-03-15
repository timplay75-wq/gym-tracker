import { useEffect } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { processQueue, getQueueLength } from '@/services/offlineQueue';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/i18n';

export function SyncManager() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const toast = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOnline && wasOffline && getQueueLength() > 0) {
      (async () => {
        const result = await processQueue();
        if (result.processed > 0) {
          toast.success(
            `${t.offline?.synced || 'Синхронизировано'}: ${result.processed} ${t.offline?.actions || 'действий'}`
          );
        }
        if (result.failed > 0) {
          toast.warning(
            `${t.offline?.syncFailed || 'Не удалось синхронизировать'}: ${result.failed}`
          );
        }
      })();
    }
  }, [isOnline, wasOffline]);

  return null;
}
