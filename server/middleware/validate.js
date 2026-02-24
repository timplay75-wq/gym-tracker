import { body, validationResult } from 'express-validator';

// Middleware: проверить результат валидации
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Правила валидации для регистрации
export const validateRegister = [
  body('name').trim().isLength({ min: 2 }).withMessage('Имя минимум 2 символа'),
  body('email').isEmail().normalizeEmail().withMessage('Некорректный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль минимум 6 символов'),
  handleValidation,
];

// Правила валидации для логина
export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Некорректный email'),
  body('password').notEmpty().withMessage('Пароль обязателен'),
  handleValidation,
];

// Правила валидации для тренировки
export const validateWorkout = [
  body('name').trim().isLength({ min: 1 }).withMessage('Название тренировки обязательно'),
  body('date').isISO8601().withMessage('Некорректная дата'),
  body('exercises').optional().isArray().withMessage('Упражнения должны быть массивом'),
  handleValidation,
];
