import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({ message: 'Не авторизован, токен отсутствует' });
  }

  let user;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findById(decoded.id).select('-password');
  } catch (error) {
    return res.status(401).json({ message: 'Не авторизован, токен недействителен' });
  }

  if (!user) {
    return res.status(401).json({ message: 'Не авторизован, токен недействителен' });
  }

  req.user = user;
  next();
};
