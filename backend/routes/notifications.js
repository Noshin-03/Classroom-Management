const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAll, markRead, markOneRead } = require('../controllers/notificationController');

router.get('/', auth, getAll);
router.put('/read-all', auth, markRead);
router.put('/:id/read', auth, markOneRead);

module.exports = router;
