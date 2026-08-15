import mongoose from 'mongoose';

/**
 * Одноразовый код авторизации между колбэком провайдера и обменом на JWT.
 *
 * Раньше коды хранились в Map в памяти процесса. На обычном сервере это
 * работало, но на serverless-платформе выдача и обмен попадают в разные
 * экземпляры функции, и код «теряется». Поэтому — общее хранилище.
 */
const OAuthCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Привязка к браузеру, который начинал вход: без неё подсунутая жертве
  // ссылка с чужим кодом залогинила бы её в чужой аккаунт.
  nonce: {
    type: String,
    required: true,
  },
  // MongoDB сама удаляет документ, когда наступает это время.
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
});

export default mongoose.model('OAuthCode', OAuthCodeSchema);
