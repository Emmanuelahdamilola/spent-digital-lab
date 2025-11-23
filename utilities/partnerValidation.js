import Joi from 'joi';

const createPartnerValidation = Joi.object({
  name: Joi.string().required().trim().min(2).max(200),
  description: Joi.string().trim().max(1000).allow("", null),
  website: Joi.string().uri().allow("", null),
  partnerType: Joi.string()
    .valid("academic", "industry", "government", "ngo", "funding", "other")
    .default("other"),
  order: Joi.number().integer().default(0),
  isPublished: Joi.boolean().default(false),
});
const updatePartnerValidation = Joi.object({
  name: Joi.string().trim().min(2).max(200),
  description: Joi.string().trim().max(1000).allow("", null),
  website: Joi.string().uri().allow("", null),
  partnerType: Joi.string().valid("academic", "industry", "government", "ngo", "funding", "other"),
  order: Joi.number().integer(),
  isPublished: Joi.boolean(),
});

export { createPartnerValidation, updatePartnerValidation };