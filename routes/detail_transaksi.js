const express = require('express');
const router = express.Router();
const Controller = require('../controllers/detail_transaksiControllers');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', authenticate,authorize('admin','staff'),Controller.getAll);
router.get('/:id', authenticate,authorize('admin','staff'),Controller.getById);

router.post('/', authenticate,authorize('admin'),Controller.create);
router.put('/:id',authenticate,authorize('admin'), Controller.update);
router.delete('/:id',authenticate,authorize('admin'), Controller.delete);

module.exports = router;