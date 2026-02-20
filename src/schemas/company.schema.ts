import Joi from "joi";

export const updateCompanySchema = Joi.object({
  name: Joi.string().min(2).max(150).messages({
    "string.empty": "El nombre de la empresa es obligatorio",
    "any.required": "El nombre de la empresa es obligatorio",
  }),

  taxId: Joi.string().min(3).max(50).messages({
    "string.empty": "El NIT / Tax ID es obligatorio",
    "any.required": "El NIT / Tax ID es obligatorio",
  }),
})
.min(1)
.unknown(false);