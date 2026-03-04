const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { submit, grade } = require('../controllers/submissionController');

router.post('/', auth, upload.single('file'), submit);
router.put('/:id/grade', auth, grade);

module.exports = router;