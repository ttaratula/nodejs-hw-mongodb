import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import createHttpError from 'http-errors';
import { User } from '../models/User.js';
import { Session } from '../models/session.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

export const loginUser = async ({ email, password }) => {
    const user = await user.findOne({ email });
  
    if (!user) {
      throw createHttpError(401, 'Invalid email or password');
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createHttpError(401, 'Invalid email or password');
    }
  
    const accessToken = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
  
    // Очистити стару сесію:
    await Session.findOneAndDelete({ userId: user._id });
  
    // Створити нову сесію:
    const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: accessExpiresAt,
      refreshTokenValidUntil: refreshExpiresAt,
    });
  
    return { accessToken, refreshToken };
};

export const refreshSession = async (oldRefreshToken) => {
    console.log('📥 refreshSession викликано з токеном:', oldRefreshToken); // 👈
    // Знайти сесію по refreshToken
    const session = await Session.findOne({ refreshToken: oldRefreshToken });
  
    if (!session) {
        console.warn('⚠️ Сесія не знайдена'); // 👈
      throw createHttpError(401, 'Invalid refresh token');
    }
  
    // Перевірити термін дії refresh токена
    if (session.refreshTokenValidUntil < new Date()) {
        console.warn('⚠️ Refresh token expired'); // 👈
      await Session.findByIdAndDelete(session._id);
      throw createHttpError(401, 'Refresh token expired');
    }
  
    // Знайти користувача
    const user = await user.findById(session.userId);
    if (!user) {
        console.warn('⚠️ Користувач не знайдений'); // 👈
      throw createHttpError(401, 'User not found');
    }
  
    // Видалити стару сесію
    await Session.findByIdAndDelete(session._id);
  
    // Згенерувати нові токени
    const accessToken = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
  
    // Записати нову сесію з оновленими токенами і термінами дії
    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });
  
    return { accessToken, refreshToken };
  };
  
  export const logoutUser = async (refreshToken) => {
    // Знайти сесію по refreshToken
    const session = await Session.findOne({ refreshToken });
  
    if (!session) {
      throw createHttpError(401, 'Invalid session or token');
    }
  
    // Видалити сесію
    await Session.findByIdAndDelete(session._id);
  };