const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getByClass, create, remove } = require('../controllers/announcementController');
const { body } = require('express-validator');

router.get('/class/:class_id', auth, getByClass);
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('class_id').notEmpty().withMessage('Class is required'),
], create);
router.delete('/:id', auth, remove);

module.exports = router;