import Subscription from '../models/Subscription.js';
import { asString, asObjectId, lookup } from '../utils/sanitize.js';

const PAYMENT_PROVIDERS = ['stripe', 'yookassa', 'manual'];

// Тарифные планы (конфигурация)
const PLANS = {
  monthly: { amount: 29900, currency: 'RUB', durationDays: 30, label: 'Месячная подписка' },
  yearly:  { amount: 249900, currency: 'RUB', durationDays: 365, label: 'Годовая подписка' },
  lifetime: { amount: 499900, currency: 'RUB', durationDays: 36500, label: 'Навсегда' },
};

// GET /api/subscriptions/plans — доступные планы
export const getPlans = async (req, res) => {
  try {
    const plans = Object.entries(PLANS).map(([id, plan]) => ({
      id,
      label: plan.label,
      amount: plan.amount,
      currency: plan.currency,
      durationDays: plan.durationDays,
    }));
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// GET /api/subscriptions/status — текущий статус подписки
export const getStatus = async (req, res) => {
  try {
    const subscription = await Subscription.getActive(req.user._id);
    if (!subscription) {
      return res.json({ active: false, subscription: null });
    }
    res.json({
      active: true,
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        startsAt: subscription.startsAt,
        expiresAt: subscription.expiresAt,
        paymentProvider: subscription.paymentProvider,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// POST /api/subscriptions/create — создать подписку (заглушка для будущей интеграции с платёжкой)
export const createSubscription = async (req, res) => {
  try {
    const plan = asString(req.body?.plan);
    const planConfig = lookup(PLANS, plan);
    if (!planConfig) {
      return res.status(400).json({ message: 'Неверный план подписки' });
    }

    const requestedProvider = asString(req.body?.paymentProvider);
    const paymentProvider = PAYMENT_PROVIDERS.includes(requestedProvider) ? requestedProvider : null;

    // Проверяем нет ли активной подписки
    const existing = await Subscription.getActive(req.user._id);
    if (existing) {
      return res.status(400).json({ message: 'У вас уже есть активная подписка' });
    }

    const startsAt = new Date();
    const expiresAt = new Date(startsAt.getTime() + planConfig.durationDays * 24 * 60 * 60 * 1000);

    // Подписка всегда создаётся неоплаченной. В 'active' её переводит только
    // вебхук платёжки с проверенной подписью — клиент на статус влиять не может.
    const subscription = await Subscription.create({
      user: req.user._id,
      plan,
      status: 'pending',
      paymentProvider,
      externalId: null,
      amount: planConfig.amount,
      currency: planConfig.currency,
      startsAt,
      expiresAt,
    });

    res.status(201).json({
      message: 'Подписка создана',
      subscription: {
        id: subscription._id,
        plan: subscription.plan,
        status: subscription.status,
        startsAt: subscription.startsAt,
        expiresAt: subscription.expiresAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// POST /api/subscriptions/cancel — отменить подписку
export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.getActive(req.user._id);
    if (!subscription) {
      return res.status(404).json({ message: 'Активная подписка не найдена' });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();

    res.json({
      message: 'Подписка отменена',
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.expiresAt,
        cancelledAt: subscription.cancelledAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// GET /api/subscriptions/history — история подписок
export const getHistory = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      subscriptions: subscriptions.map(s => ({
        id: s._id,
        plan: s.plan,
        status: s.status,
        amount: s.amount,
        currency: s.currency,
        startsAt: s.startsAt,
        expiresAt: s.expiresAt,
        cancelledAt: s.cancelledAt,
        paymentProvider: s.paymentProvider,
        createdAt: s.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// POST /api/subscriptions/webhook — webhook для платёжных провайдеров (заглушка)
export const handleWebhook = async (req, res) => {
  try {
    // Все значения приводим к строке: без этого {"externalId":{"$ne":null}}
    // превращался в оператор Mongo и матчил чужую подписку.
    const event = asString(req.body?.event);
    const status = asString(req.body?.status);
    const externalId = asString(req.body?.externalId);
    const subscriptionId = asObjectId(req.body?.subscriptionId);

    if (!externalId && !subscriptionId) {
      return res.status(400).json({ message: 'Нужен subscriptionId или externalId' });
    }

    const filter = subscriptionId ? { _id: subscriptionId } : { externalId };
    const subscription = await Subscription.findOne(filter);
    if (!subscription) {
      return res.status(404).json({ message: 'Подписка не найдена' });
    }

    // Обновляем статус на основании события от провайдера
    if (status === 'succeeded' || event === 'payment.succeeded') {
      subscription.status = 'active';
      if (externalId) subscription.externalId = externalId;
    } else if (status === 'cancelled' || event === 'subscription.cancelled') {
      subscription.status = 'cancelled';
      subscription.cancelledAt = new Date();
    } else if (status === 'expired' || event === 'subscription.expired') {
      subscription.status = 'expired';
    } else {
      return res.status(400).json({ message: 'Неизвестное событие' });
    }

    await subscription.save();
    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обработки webhook' });
  }
};
