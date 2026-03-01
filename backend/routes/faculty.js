const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAll } = require('../controllers/facultyController');

router.get('/', auth, getAll);

module.exports = router;