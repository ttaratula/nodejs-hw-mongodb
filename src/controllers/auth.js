import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';
import { refreshSession } from '../services/auth.js';
import createHttpError from 'http-errors';
import { requestResetToken, resetPassword } from '../services/email.js';

export const registerController = async (req, res, next) => {
  try {
    const photo = req.file?.path || ""; // якщо Cloudinary, це вже буде URL
    const user = await registerUser({ ...req.body, photo });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo || null,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res) => {
    const { email, password } = req.body;
  
    const { accessToken, refreshToken } = await loginUser({ email, password });
  
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
      })
      .status(200)
      .json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: { accessToken },
      });
  };

  export const refreshSessionController = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw createHttpError(401, 'Refresh token missing');
      }
  
      const { accessToken, refreshToken: newRefreshToken } = await refreshSession(refreshToken);
  
      res
        .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          status: 200,
          message: 'Successfully refreshed a session!',
          data: { accessToken },
        });
    } catch (error) {
      next(error);
    }
};


export const logoutUserController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token found' });
    }

    await logoutUser(refreshToken);

    // Видаляємо cookie з refreshToken
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

