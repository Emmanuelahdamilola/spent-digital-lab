import Joi from 'joi';

const createTeamValidation = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  position: Joi.string().required().trim(),
  bio: Joi.string().required().trim().min(10).max(1000),
  email: Joi.string().email().allow('', null),
  phone: Joi.string().trim().allow('', null),
  socialLinks: Joi.object({
    linkedin: Joi.string().uri().allow('', null),
    twitter: Joi.string().uri().allow('', null),
    researchGate: Joi.string().uri().allow('', null),
    googleScholar: Joi.string().uri().allow('', null)
  }).default({}),
  department: Joi.string().trim().allow('', null),
  order: Joi.number().integer().default(0),
  isPublished: Joi.boolean().default(false)
});

const updateTeamValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  position: Joi.string().trim(),
  bio: Joi.string().trim().min(10).max(1000),
  email: Joi.string().email().allow('', null),
  phone: Joi.string().trim().allow('', null),
  socialLinks: Joi.object({
    linkedin: Joi.string().uri().allow('', null),
    twitter: Joi.string().uri().allow('', null),
    researchGate: Joi.string().uri().allow('', null),
    googleScholar: Joi.string().uri().allow('', null)
  }).default({}),
  department: Joi.string().trim().allow('', null),
  order: Joi.number().integer(),
  isPublished: Joi.boolean()
}).min(1);

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    });
  }
  req.validatedBody = value;
  next();
};

export { createTeamValidation, updateTeamValidation, validate };
