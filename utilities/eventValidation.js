import Joi from "joi";

// Create Event Validation
export const validateEventCreate = (req, res, next) => {
  // 🔧 FIX: Trim whitespace from keys in req.body
  const trimmedBody = {};
  for (const key in req.body) {
    trimmedBody[key.trim()] = req.body[key];
  }
  req.body = trimmedBody;

  // Parse tags if it's a string (from form-data)
  if (req.body.tags && typeof req.body.tags === 'string') {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (e) {
      req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
  }

  // Convert string booleans to actual booleans
  if (req.body.isPublished !== undefined) {
    req.body.isPublished = req.body.isPublished === 'true' || req.body.isPublished === true;
  }

  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),

    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref("startDate")).required(),

    location: Joi.string().required(),

    eventType: Joi.string()
      .valid("conference", "workshop", "seminar", "webinar", "symposium", "other")
      .default("other"),

    registrationLink: Joi.string().uri().allow("", null),

    tags: Joi.array().items(Joi.string()).default([]),

    isPublished: Joi.boolean().default(false),
  });

  const { error, value } = schema.validate(req.body, {
    stripUnknown: true,
    convert: true
  });

  if (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message 
    });
  }

  req.validatedBody = value;
  next();
};

// Update Event Validation
export const validateEventUpdate = (req, res, next) => {
  // 🔧 FIX: Trim whitespace from keys in req.body
  const trimmedBody = {};
  for (const key in req.body) {
    trimmedBody[key.trim()] = req.body[key];
  }
  req.body = trimmedBody;

  // Parse tags if it's a string
  if (req.body.tags && typeof req.body.tags === 'string') {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (e) {
      req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
  }

  // Convert string booleans to actual booleans
  if (req.body.isPublished !== undefined) {
    req.body.isPublished = req.body.isPublished === 'true' || req.body.isPublished === true;
  }

  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date().when('startDate', {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref('startDate')),
      otherwise: Joi.date()
    }),
    location: Joi.string(),
    eventType: Joi.string().valid(
      "conference",
      "workshop",
      "seminar",
      "webinar",
      "symposium",
      "other"
    ),
    registrationLink: Joi.string().uri().allow("", null),
    tags: Joi.array().items(Joi.string()),
    isPublished: Joi.boolean(),
  });

  const { error, value } = schema.validate(req.body, {
    stripUnknown: true,
    convert: true
  });

  if (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message 
    });
  }

  req.validatedBody = value;
  next();
};
