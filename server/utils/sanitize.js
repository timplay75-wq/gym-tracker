// Значения из req.body и req.query не обязательно строки: Express разбирает
// `?category[$ne]=x` и JSON-тело в объекты, поэтому значение, ушедшее в фильтр
// Mongo без приведения типа, превращается в оператор запроса.

/**
 * Приводит значение к строке. Объекты и массивы (потенциальные операторы Mongo)
 * отбрасываются в null.
 */
export function asString(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return null;
}

/** Валидный 24-символьный ObjectId либо null. */
export function asObjectId(value) {
  const str = asString(value);
  return str && /^[a-f\d]{24}$/i.test(str) ? str : null;
}

/**
 * Оставляет только разрешённые поля. Отсекает и операторы верхнего уровня
 * ($set, $inc, ...), и поля, которые клиент менять не должен (userId, coins).
 */
export function pick(source, allowed) {
  const result = {};
  if (!source || typeof source !== 'object' || Array.isArray(source)) return result;
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * Безопасный доступ к словарю-константе по ключу от клиента: обычный
 * `PLANS[plan]` отдаёт унаследованные свойства, и `plan=constructor`
 * проходит проверку на существование.
 */
export function lookup(dict, key) {
  const str = asString(key);
  if (str === null) return undefined;
  return Object.prototype.hasOwnProperty.call(dict, str) ? dict[str] : undefined;
}
