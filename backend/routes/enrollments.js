const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAll, getByClass, enroll, remove } = require('../controllers/enrollmentController');

router.get('/', auth, getAll);
router.get('/class/:classId', auth, getByClass);
router.post('/', auth, enroll);
router.delete('/:id', auth, remove);

module.exports = router;