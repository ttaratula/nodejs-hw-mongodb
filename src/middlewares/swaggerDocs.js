import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import { SWAGGER_PATH } from '../constants/index.js';
import YAML from 'yamljs';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = YAML.load(SWAGGER_PATH);
    return { serve: swaggerUI.serve, setup: swaggerUI.setup(swaggerDoc) };
  } catch (err) {
    console.error("Swagger load error:", err.message);
    return {
      serve: (req, res, next) => next(createHttpError(500, "Can't load swagger docs")),
      setup: (req, res, next) => next(createHttpError(500, "Can't load swagger docs")),
    };
  }
};