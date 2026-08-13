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
    // Раньше условие включало wasOffline, то есть отправка запускалась только
    // на живом переходе offline→online. Очередь, оставшаяся с прошлого запуска
    // (приложение закрыли без сети), не уходила уже никогда.
    if (!isOnline || getQueueLength() === 0) return;

    let cancelled = false;
    (async () => {
      const result = await processQueue();
      if (cancelled) return;

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
      if (result.dropped > 0) {
        toast.error(
          `Не удалось отправить после нескольких попыток: ${result.dropped}. Данные сохранены локально.`
        );
      }
    })();

    return () => { cancelled = true; };
    // wasOffline остаётся в зависимостях как триггер повторной попытки
    // сразу после возврата сети.
  }, [isOnline, wasOffline]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
