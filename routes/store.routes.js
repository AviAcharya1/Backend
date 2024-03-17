const express = require('express');
const roomController = require('../controllers/store.control');
const isAuth = require('../middlewares/Authentication');

const router = express.Router();

router.post('/join/:roomId', isAuth, roomController.joinRoom);

router.get('/:roomId', isAuth, roomController.getRoom);

module.exports = router;
