const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAll, create, getById, remove } = require('../controllers/classController');
const { body } = require('express-validator');

router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.post('/', auth, [
  body('name').notEmpty().withMessage('Name is required'),
  body('subject_id').notEmpty().withMessage('Subject is required'),
], create);
router.delete('/:id', auth, remove);

module.exports = router;