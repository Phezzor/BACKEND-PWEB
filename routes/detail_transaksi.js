const express = require('express');
const router = express.Router();
const Controller = require('../controllers/detail_transaksiControllers');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', authenticate,authorize('admin'),Controller.getAll);
router.get('/:id', Controller.getById);

router.post('/', Controller.create);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.delete);

module.exports = router;