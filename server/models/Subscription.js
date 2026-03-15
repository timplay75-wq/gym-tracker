import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  plan: {
    type: String,
    enum: ['monthly', 'yearly', 'lifetime'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'pending'],
    default: 'pending',
  },
  // Какой внешний провайдер (Stripe, YooKassa, и т.д.)
  paymentProvider: {
    type: String,
    enum: ['stripe', 'yookassa', 'manual', null],
    default: null,
  },
  // Внешний ID транзакции / подписки у провайдера
  externalId: {
    type: String,
    default: null,
  },
  // Сумма в копейках / центах
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'RUB',
  },
  startsAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Автоматическая проверка истечения
SubscriptionSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

// Статический метод: активная подписка пользователя
SubscriptionSchema.statics.getActive = async function (userId) {
  return this.findOne({
    user: userId,
    status: 'active',
    expiresAt: { $gt: new Date() },
  }).sort({ expiresAt: -1 });
};

export default mongoose.model('Subscription', SubscriptionSchema);
