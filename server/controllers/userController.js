import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Форматирование ответа
const userResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar || null,
  goal: user.goal || null,
  weight: user.weight || null,
  height: user.height || null,
  createdAt: user.createdAt,
  ...(token && { token }),
});

// POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Все поля обязательны' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Пароль минимум 6 символов' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });

    const user = await User.create({ name, email, password });
    res.status(201).json(userResponse(user, generateToken(user._id)));
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
};

// POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email и пароль обязательны' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user)
      return res.status(401).json({ message: 'Неверный email или пароль' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Неверный email или пароль' });

    res.json(userResponse(user, generateToken(user._id)));
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
};

// GET /api/users/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(userResponse(user));
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// PUT /api/users/me
export const updateMe = async (req, res) => {
  try {
    const allowed = ['name', 'avatar', 'goal', 'weight', 'height'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    if (updates.name && updates.name.trim().length < 2)
      return res.status(400).json({ message: 'Имя минимум 2 символа' });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json(userResponse(user));
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Ошибка обновления профиля' });
  }
};

// PUT /api/users/me/password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Оба поля обязательны' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Новый пароль минимум 6 символов' });

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Текущий пароль неверен' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Пароль успешно изменён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка смены пароля' });
  }
};

// DELETE /api/users/me
export const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Аккаунт удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления аккаунта' });
  }
};

// POST /api/users/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email обязателен' });

    const user = await User.findOne({ email: email.toLowerCase() });
    // Всегда отвечаем 200, чтобы не раскрывать наличие email
    if (!user || user.oauthProvider) {
      return res.json({ message: 'Если email зарегистрирован, вы получите письмо' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${token}`;

    // Production: отправляем реальный email через SMTP
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Gym Tracker" <noreply@gymtracker.app>',
        to: user.email,
        subject: 'Gym Tracker — Сброс пароля',
        html: `
          <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #7C4DFF;">💪 Gym Tracker</h2>
            <p>Вы запросили сброс пароля.</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #7C4DFF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Сбросить пароль</a>
            <p style="margin-top: 16px; font-size: 13px; color: #666;">Ссылка действительна 1 час.</p>
          </div>
        `,
      });
      console.log(`[Reset Password] Email sent to ${user.email}`);
      res.json({ message: 'Если email зарегистрирован, вы получите письмо' });
    } else {
      // Development: возвращаем ссылку прямо в ответе
      console.log(`[Reset Password] 🔗 Link: ${resetUrl}`);
      res.json({
        message: 'Если email зарегистрирован, вы получите письмо',
        devResetUrl: resetUrl,
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// POST /api/users/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: 'Токен и пароль обязательны' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Пароль минимум 6 символов' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Токен недействителен или истёк' });

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Пароль успешно изменён' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
