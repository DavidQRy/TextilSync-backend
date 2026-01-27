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
