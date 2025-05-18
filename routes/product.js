const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productControllers');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Admin hanya bisa tambah produk
router.post('/', authenticate, authorize('admin'), productControllers.create);

// Admin & Staff bisa lihat produk
router.get('/', authenticate, authorize('admin', 'staff'), productControllers.getAll);

// Admin & Staff bisa update produk
router.put('/:id', authenticate, authorize('admin', 'staff'), productControllers.update);

// Admin & Staff bisa hapus produk
router.delete('/:id', authenticate, authorize('admin', 'staff'), productControllers.delete);

module.exports = router;
