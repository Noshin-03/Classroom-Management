const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAll, create, getById, update, remove } = require('../controllers/subjectController');
const { body } = require('express-validator');

router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.post('/', auth, [
  body('code').notEmpty().withMessage('Code is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('department_id').notEmpty().withMessage('Department is required'),
], create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;