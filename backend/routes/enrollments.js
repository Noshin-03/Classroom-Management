const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAll, enroll, remove } = require('../controllers/enrollmentController');

router.get('/', auth, getAll);
router.post('/', auth, enroll);
router.delete('/:id', auth, remove);

module.exports = router;