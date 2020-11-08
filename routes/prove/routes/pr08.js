const router = require('express').Router();
const proveController = require('../controllers/pr08');

router.get('/', proveController.getProve08);
router.get('/prev', proveController.getPrev);
router.get('/next', proveController.getNext);
router.get('/:id', proveController.getPage);

module.exports = router;
