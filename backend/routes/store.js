const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Create order
router.post('/order', async (req, res) => {
  const { items, total } = req.body;

  try {
    const order = new Order({ items, total });
    await order.save();
    res.json({ msg: 'Order placed successfully', orderId: order._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get orders (for admin)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;