import Joi from 'joi';
import validate from '../middleware/validate.js'; // Import the validate function

const createPublicationValidation = Joi.object({
  title: Joi.string().required().trim().min(3).max(300),
  authors: Joi.array().items(Joi.string().trim()).min(1).required(),
  abstract: Joi.string().required().trim().min(10).max(3000),
  journal: Joi.string().trim().allow('', null),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
  doi: Joi.string().trim().allow('', null),
  externalLink: Joi.string().uri().allow('', null),
  tags: Joi.array().items(Joi.string().trim()).max(10).default([]),
  isPublished: Joi.boolean().default(false)
});

const updatePublicationValidation = Joi.object({
  title: Joi.string().trim().min(3).max(300),
  authors: Joi.array().items(Joi.string().trim()).min(1),
  abstract: Joi.string().trim().min(10).max(3000),
  journal: Joi.string().trim().allow('', null),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
  doi: Joi.string().trim().allow('', null),
  externalLink: Joi.string().uri().allow('', null),
  tags: Joi.array().items(Joi.string().trim()).max(10),
  isPublished: Joi.boolean()
}).min(1);

export { createPublicationValidation, updatePublicationValidation, validate };