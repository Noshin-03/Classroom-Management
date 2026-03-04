const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getByClass, create, getById, remove } = require('../controllers/assignmentController');
const { body } = require('express-validator');

router.get('/class/:class_id', auth, getByClass);
router.get('/:id', auth, getById);
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('class_id').notEmpty().withMessage('Class is required'),
], create);
router.delete('/:id', auth, remove);

module.exports = router;
