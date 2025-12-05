import Joi from "joi";

export const createResearchValidation = Joi.object({
  title: Joi.string().trim().min(3).max(300).required(),
  abstract: Joi.string().allow("", null).max(5000),
  authors: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()).max(20),
    Joi.string().trim()
  ).default([]),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()).max(20),
    Joi.string().trim()
  ).default([]),
  categories: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()).max(10),
    Joi.string().trim()
  ).default([]),
  isPublished: Joi.boolean().default(false)
});

export const updateResearchValidation = Joi.object({
  title: Joi.string().trim().min(3).max(300),
  abstract: Joi.string().allow("", null).max(5000),
  authors: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()).max(20),
    Joi.string().trim()
  ),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()).max(20),
    Joi.string().trim()
  ),
  categories: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()).max(10),
    Joi.string().trim()
  ),
  isPublished: Joi.boolean()
}).min(1);
