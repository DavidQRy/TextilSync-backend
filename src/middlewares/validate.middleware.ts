import { RequestHandler } from "express";
import { Schema } from "joi";

/**
 * Middleware genérico para validar el cuerpo (body) de una solicitud HTTP
 * utilizando un esquema de Joi. Si la validación falla, se retorna un error 400
 * con el mensaje correspondiente. Si es exitosa, continúa hacia el siguiente middleware.
 * @param {import('joi').Schema} schema - Esquema Joi utilizado para validar el contenido de req.body.
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void}
 * Middleware que procesa la validación y responde automáticamente cuando existe un error.
 * @example
 * import express from 'express';
 * import validate from '#middlewares/validate.middleware';
 * import { authSchema } from '#schemas/auth.schema';
 *
 * const router = express.Router();
 *
 * // Ejemplo: validar body para el login
 * router.post('/api/auth', validate(authSchema), authorizeAndGenerateToken);
 * @example
 * // Ejemplo en un register:
 * router.post('/api/register',
 *   authenticate,
 *   validate(registerSchema),
 *   registerController
 * );
 */
export const validate = (schema: Schema): RequestHandler => (req, res, next) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  req.body = value;
  return next();
};

export default validate;