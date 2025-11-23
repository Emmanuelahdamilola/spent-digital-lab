import Joi from 'joi';

const createEventValidation = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().required().trim().min(10).max(2000),
  startDate: Joi.date().required(),
  endDate: Joi.date().required().greater(Joi.ref('startDate')),
  location: Joi.string().required().trim(),
  eventType: Joi.string().valid('conference', 'workshop', 'seminar', 'webinar', 'symposium', 'other').default('other'),
  registrationLink: Joi.string().uri().allow('', null),
  tags: Joi.array().items(Joi.string().trim()).max(10).default([]),
  isPublished: Joi.boolean().default(false)
});

const updateEventValidation = Joi.object({
  title: Joi.string().trim().min(3).max(200),
  description: Joi.string().trim().min(10).max(2000),
  startDate: Joi.date(),
  endDate: Joi.date(),
  location: Joi.string().trim(),
  eventType: Joi.string().valid('conference', 'workshop', 'seminar', 'webinar', 'symposium', 'other'),
  registrationLink: Joi.string().uri().allow('', null),
  tags: Joi.array().items(Joi.string().trim()).max(10),
  isPublished: Joi.boolean()
}).min(1);

export { createEventValidation, updateEventValidation };
