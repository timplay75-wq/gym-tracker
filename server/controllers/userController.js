import User from '../models/User.js';
import jwt from 'jsonwebtoken';

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
