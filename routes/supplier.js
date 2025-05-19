const express = require('express');
const router = express.Router();
const controller = require('../controllers/suppliersControllers');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/',authenticate,authorize('admin','staff'), controller.getAll);
router.get('/:id', authenticate,authorize('admin','staff'),controller.getById);

router.post('/',authenticate, authorize('admin'), controller.create);

router.put('/:id', authenticate,authorize('admin'),controller.update);

router.delete('/:id', authenticate,authorize('admin'),controller.delete);

module.exports = router;
