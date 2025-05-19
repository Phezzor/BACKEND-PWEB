const express = require('express');
const router = express.Router();
const controller = require('../controllers/userControllers');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// GET
router.get('/',authenticate,authorize('admin'), controller.getAll);
router.get('/:id',authenticate,authorize('admin'), controller.getById);


module.exports = router;
