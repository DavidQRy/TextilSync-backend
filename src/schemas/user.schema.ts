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
  roleId: Joi.number().integer().positive().required().messages({
    "number.base": "El roleId debe ser un número",
    "number.integer": "El roleId debe ser un número entero",
    "number.positive": "El roleId debe ser un número positivo",
    "any.required": "El roleId es obligatorio",
  }),
});


export const userUpdateSchema = Joi.object({
  // email: Joi.string().email().messages({
  //   "string.email": "El email no es válido",
  //   "string.empty": "El email es obligatorio"
  // }),
  fullName: Joi.string()
    .min(3)
    .max(100)
    .messages({
      "string.base": "El nombre completo debe ser un texto",
      "string.empty": "El nombre completo no puede estar vacío",
      "string.min": "El nombre debe tener al menos 3 caracteres",
      "string.max": "El nombre no puede exceder 100 caracteres",
    }),

  password: Joi.string()
    .min(6)
    .max(100)
    .messages({
      "string.base": "La contraseña debe ser un texto",
      "string.empty": "La contraseña no puede estar vacía",
      "string.min": "La contraseña debe tener al menos 6 caracteres",
      "string.max": "La contraseña no puede exceder 100 caracteres",
    }),

  roleId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El roleId debe ser un número",
      "number.integer": "El roleId debe ser un número entero",
      "number.positive": "El roleId debe ser un número positivo",
    }),

  active: Joi.boolean()
    .messages({
      "boolean.base": "El campo active debe ser verdadero o falso",
    }),
})
.min(1) // 👈 obliga a que al menos un campo venga en el update
.unknown(false);
