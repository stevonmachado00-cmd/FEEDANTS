const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateRequest');
const Joi = require('joi');
const { authLimiter } = require('../middleware/rateLimiter');

const signupSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().allow('').optional(),
  email: Joi.string().email().allow('').optional(),
}).unknown(true);

const loginSchema = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().optional(),
  password: Joi.string().required(),
}).or('username', 'email').unknown(true);

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', protect, authController.logout);

module.exports = router;
