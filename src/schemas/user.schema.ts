import Joi from "joi";

/**
 * Joi schema for creating a user
 */
export const userCreateSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "El email no es válido",
    "string.empty": "El email es obligatorio",
    "any.required": "El email es obligatorio",
  }),

  fullName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre completo es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede exceder 100 caracteres",
    "any.required": "El nombre completo es obligatorio",
  }),

  password: Joi.string().min(6).max(100).required().messages({
    "string.empty": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "string.max": "La contraseña no puede exceder 100 caracteres",
    "any.required": "La contraseña es obligatoria",
  }),
  companyId: Joi.string().uuid().required().messages({
    "string.guid": "El companyId debe ser un UUID válido",
    "any.required": "El companyId es obligatorio",
  }),

  roleId: Joi.number().integer().positive().required().messages({
    "number.base": "El roleId debe ser un número",
    "number.integer": "El roleId debe ser un número entero",
    "number.positive": "El roleId debe ser un número positivo",
    "any.required": "El roleId es obligatorio",
  }),
});
