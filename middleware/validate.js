
const validate = (schema) => (req, res, next) => {
  const payload = { ...req.body };

  // If form-data: authors, tags may be strings — try to convert JSON strings
  // (client may send authors as JSON string)
  try {
    ["authors","tags","categories"].forEach((key) => {
      if (payload[key] && typeof payload[key] === "string") {
        // try parse JSON array, else keep as single string
        try {
          const p = JSON.parse(payload[key]);
          payload[key] = p;
        } catch {
          // if comma separated
          payload[key] = payload[key].split(",").map(s => s.trim()).filter(Boolean);
        }
      }
    });
  } catch {}

  const { error, value } = schema.validate(payload, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(", ") });
  }
  // attach sanitized body for controller
  req.validatedBody = value;
  next();
};

export default validate;

