const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/', orderController.createOrder);
router.get('/', authenticate, isAdmin, orderController.getAllOrders);
router.get('/stats', authenticate, isAdmin, orderController.getOrderStats);
router.get('/number/:orderNumber', orderController.getOrderByNumber);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', authenticate, isAdmin, orderController.updateOrderStatus);

module.exports = router;
