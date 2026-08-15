import nodemailer from 'nodemailer';

/**
 * Отправка почты через первый настроенный способ.
 *
 * На serverless (Vercel, Lambda) SMTP не работает: исходящие соединения по
 * почтовым портам виснут и отваливаются по таймауту. Поэтому сначала пробуем
 * провайдеров, работающих по HTTP, и только потом SMTP — он остаётся для
 * обычного сервера, Docker и VPS.
 */

const fromAddress = () =>
  process.env.MAIL_FROM || process.env.SMTP_FROM || 'Gym Tracker <noreply@gymtracker.app>';

/** Разбирает "Имя <адрес@домен>" на части — Brevo требует отправителя объектом. */
function parseFrom(value) {
  const match = /^\s*(.*?)\s*<(.+?)>\s*$/.exec(value);
  if (!match) return { email: value.trim() };
  const name = match[1].replace(/^"|"$/g, '').trim();
  return name ? { name, email: match[2] } : { email: match[2] };
}

export function isMailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY ||
    process.env.BREVO_API_KEY ||
    (process.env.SMTP_HOST && process.env.SMTP_USER)
  );
}

async function sendViaResend({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: fromAddress(), to: [to], subject, html }),
  });
  if (!res.ok) throw new Error(`Resend ответил ${res.status}: ${await res.text()}`);
}

async function sendViaBrevo({ to, subject, html }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: parseFrom(fromAddress()),
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) throw new Error(`Brevo ответил ${res.status}: ${await res.text()}`);
}

async function sendViaSmtp({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({ from: fromAddress(), to, subject, html });
}

/** Выбор способа по тому, какие ключи заданы. HTTP имеет приоритет над SMTP. */
export async function sendMail(message) {
  if (process.env.RESEND_API_KEY) return sendViaResend(message);
  if (process.env.BREVO_API_KEY) return sendViaBrevo(message);
  if (process.env.SMTP_HOST && process.env.SMTP_USER) return sendViaSmtp(message);
  throw new Error('Отправка почты не настроена');
}
