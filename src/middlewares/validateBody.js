import createError from 'http-errors';

export function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return next(createError(400, error.message));
    }

    next();
  };
}
