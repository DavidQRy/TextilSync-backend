import Joi from "joi";

export const loginSchema = Joi.object({

    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "El email no es válido",
        "string.empty": "El email es obligatorio",
        "any.required": "El email es obligatorio",
    }),

    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        "string.empty": "La contraseña es obligatoria",
        "any.required": "La contraseña es obligatoria",
    }),

});


export const registerSchema = Joi.object({
  user: Joi.object({
    fullName: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        "string.empty": "El nombre completo es obligatorio",
        "any.required": "El nombre completo es obligatorio",
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "El email no es válido",
        "string.empty": "El email es obligatorio",
        "any.required": "El email es obligatorio",
      }),

    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        "string.empty": "La contraseña es obligatoria",
        "any.required": "La contraseña es obligatoria",
      }),
  }).required(),

  company: Joi.object({
    name: Joi.string()
      .min(2)
      .max(150)
      .required()
      .messages({
        "string.empty": "El nombre de la empresa es obligatorio",
        "any.required": "El nombre de la empresa es obligatorio",
      }),

    taxId: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.empty": "El NIT / Tax ID es obligatorio",
        "any.required": "El NIT / Tax ID es obligatorio",
      }),
  }).required(),
});
