const express = require('express');
const router = express.Router();
const { register, login, updateProfile, updatePassword } = require('../controllers/authController');
const { body } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], register);

router.post('/login', [
  body('email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], login);

router.put('/profile', auth, updateProfile);
router.put('/password', auth, updatePassword);

module.exports = router;