import { ApiError } from './errorHandler.js';

/**
 * Valida partes de la request (body/params/query) contra esquemas zod.
 * Uso: validate({ body: createUserSchema })
 */
export function validate(schemas) {
  return (req, _res, next) => {
    for (const key of ['body', 'params', 'query']) {
      const schema = schemas[key];
      if (!schema) continue;

      const result = schema.safeParse(req[key]);
      if (!result.success) {
        return next(new ApiError(400, 'Datos inválidos', result.error.flatten()));
      }
      req[key] = result.data;
    }
    next();
  };
}
