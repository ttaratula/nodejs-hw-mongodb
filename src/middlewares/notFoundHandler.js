import createError from 'http-errors';

export function notFoundHandler(req, _res, next) {
  next(createError(404, 'Route not found'));
}
