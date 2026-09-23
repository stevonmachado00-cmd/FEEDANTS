const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(i => i.message).join(', ');
      return res.status(400).json({ success: false, message: messages });
    }
    next();
  };
};

module.exports = validate;
