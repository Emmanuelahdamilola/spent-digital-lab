const Joi = require('joi');

const createResearchValidation = Joi.object({
  title: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(200)
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 200 characters'
    }),
  
  summary: Joi.string()
    .required()
    .trim()
    .min(10)
    .max(2000)
    .messages({
      'string.empty': 'Summary is required',
      'string.min': 'Summary must be at least 10 characters',
      'string.max': 'Summary cannot exceed 2000 characters'
    }),
  
  author: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(100)
    .messages({
      'string.empty': 'Author is required',
      'string.min': 'Author name must be at least 2 characters'
    }),
  
  tags: Joi.array()
    .items(Joi.string().trim().max(50))
    .max(10)
    .default([])
    .messages({
      'array.max': 'Cannot have more than 10 tags'
    }),
  
  isPublished: Joi.boolean().default(false)
});

const updateResearchValidation = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 200 characters'
    }),
  
  summary: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .messages({
      'string.min': 'Summary must be at least 10 characters',
      'string.max': 'Summary cannot exceed 2000 characters'
    }),
  
  author: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .messages({
      'string.min': 'Author name must be at least 2 characters'
    }),
  
  tags: Joi.array()
    .items(Joi.string().trim().max(50))
    .max(10)
    .messages({
      'array.max': 'Cannot have more than 10 tags'
    }),
  
  isPublished: Joi.boolean()
}).min(1); // At least one field must be present

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    req.validatedBody = value;
    next();
  };
};

export {
  validateCreateResearch,
  validateUpdateResearch
};
