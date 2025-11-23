import Joi from 'joi';

const createProgramValidation = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().required().trim().min(10).max(3000),
  duration: Joi.string().trim().allow('', null),
  eligibility: Joi.string().trim().allow('', null),
  programType: Joi.string().valid('undergraduate', 'graduate', 'phd', 'certificate', 'diploma', 'short-course', 'other').default('other'),
  applicationLink: Joi.string().uri().allow('', null),
  tags: Joi.array().items(Joi.string().trim()).max(10).default([]),
  isPublished: Joi.boolean().default(false)
});

const updateProgramValidation = Joi.object({
  title: Joi.string().trim().min(3).max(200),
  description: Joi.string().trim().min(10).max(3000),
  duration: Joi.string().trim().allow('', null),
  eligibility: Joi.string().trim().allow('', null),
  programType: Joi.string().valid('undergraduate', 'graduate', 'phd', 'certificate', 'diploma', 'short-course', 'other'),
  applicationLink: Joi.string().uri().allow('', null),
  tags: Joi.array().items(Joi.string().trim()).max(10),
  isPublished: Joi.boolean()
});

export { createProgramValidation, updateProgramValidation };