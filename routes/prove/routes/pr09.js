const router = require('express').Router();
const proveController = require('../controllers/pr09');

router.get('/', proveController.getProve);
router.get('/prev', proveController.getPrev);
router.get('/next', proveController.getNext);

module.exports = router;
