const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submit, grade } = require('../controllers/submissionController');

router.post('/', auth, submit);
router.put('/:id/grade', auth, grade);

module.exports = router;
