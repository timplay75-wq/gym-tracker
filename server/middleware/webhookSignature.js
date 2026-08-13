import crypto from 'crypto';

const SIGNATURE_HEADER = 'x-webhook-signature';

/**
 * Проверяет HMAC-SHA256 подпись тела запроса.
 *
 * Подпись считается по сырым байтам (req.rawBody, его наполняет express.json
 * через verify), потому что после JSON.parse порядок ключей и пробелы теряются
 * и пересобранное тело не совпадёт с тем, что подписал провайдер.
 *
 * Ожидаемый заголовок: x-webhook-signature: sha256=<hex>
 */
export const verifyWebhookSignature = (req, res, next) => {
  const secret = process.env.SUBSCRIPTION_WEBHOOK_SECRET;

  // Без секрета вебхук принимать нельзя: иначе любой может активировать
  // себе подписку. Отказ по умолчанию, а не пропуск.
  if (!secret) {
    console.error('[Webhook] SUBSCRIPTION_WEBHOOK_SECRET не задан — вебхуки отклоняются');
    return res.status(503).json({ message: 'Webhook не сконфигурирован' });
  }

  const header = req.get(SIGNATURE_HEADER);
  if (!header || typeof header !== 'string') {
    return res.status(401).json({ message: 'Подпись отсутствует' });
  }

  if (!req.rawBody || req.rawBody.length === 0) {
    return res.status(400).json({ message: 'Пустое тело запроса' });
  }

  const received = header.startsWith('sha256=') ? header.slice(7) : header;
  const expected = crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');

  const receivedBuf = Buffer.from(received, 'utf8');
  const expectedBuf = Buffer.from(expected, 'utf8');

  // timingSafeEqual бросает на буферах разной длины — сравниваем длину заранее.
  if (receivedBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(receivedBuf, expectedBuf)) {
    return res.status(401).json({ message: 'Неверная подпись' });
  }

  next();
};
