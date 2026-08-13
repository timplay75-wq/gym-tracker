/**
 * Фейковый res, повторяющий важное для тестов поведение Express: повторная
 * отправка ответа бросает исключение, как настоящий ERR_HTTP_HEADERS_SENT.
 * Именно на этом ловится баг с двойным res.status().json().
 */
export function createRes() {
  const res = {
    statusCode: 200,
    body: undefined,
    headersSent: false,
    redirectedTo: undefined,
    cookies: [],
    clearedCookies: [],

    status(code) {
      res.statusCode = code;
      return res;
    },

    json(payload) {
      res.assertNotSent();
      res.headersSent = true;
      res.body = payload;
      return res;
    },

    redirect(url) {
      res.assertNotSent();
      res.headersSent = true;
      res.redirectedTo = url;
      return res;
    },

    cookie(name, value, options) {
      res.cookies.push({ name, value, options });
      return res;
    },

    clearCookie(name, options) {
      res.clearedCookies.push({ name, options });
      return res;
    },

    assertNotSent() {
      if (res.headersSent) {
        throw new Error('ERR_HTTP_HEADERS_SENT: ответ отправлен повторно');
      }
    },
  };
  return res;
}

export function createReq(overrides = {}) {
  return {
    headers: {},
    body: {},
    query: {},
    params: {},
    get(name) {
      return this.headers[String(name).toLowerCase()];
    },
    ...overrides,
  };
}

/** Считает, сколько раз был вызван next() — ответ и next взаимоисключающи. */
export function createNext() {
  const calls = [];
  const next = (...args) => { calls.push(args); };
  next.calls = calls;
  return next;
}
