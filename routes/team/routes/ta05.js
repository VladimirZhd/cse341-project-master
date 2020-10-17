const router = require('express').Router();

const ta05Controller = require('../controllers/ta05.controller');

router.get('/', ta05Controller.getTA05);

module.exports = router;
