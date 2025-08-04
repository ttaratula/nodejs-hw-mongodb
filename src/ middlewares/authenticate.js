import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

export const authenticate = (req, res, next) => {
  try {
    // Читаємо токен з заголовку Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createHttpError(401, 'Authorization header missing');
    }

    // Токен має бути у форматі "Bearer <token>"
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw createHttpError(401, 'Invalid authorization format');
    }

    // Перевіряємо access token
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Додаємо інформацію про користувача в об'єкт запиту
    req.user = {
      id: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    next(createHttpError(401, error.message || 'Unauthorized'));
  }
};
