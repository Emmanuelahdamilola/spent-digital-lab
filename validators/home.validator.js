import Joi from "joi";

export const updateHomeValidation = Joi.object({
  heroTitle: Joi.string().trim(),
  heroSubtitle: Joi.string().trim(),
  ctaText: Joi.string().trim(),
  ctaLink: Joi.string().uri(),

  featuredResearch: Joi.array().items(Joi.string()),
  featuredPublications: Joi.array().items(Joi.string()),

  highlights: Joi.array().items(
    Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      icon: Joi.string().allow(null, "")
    })
  )
});
