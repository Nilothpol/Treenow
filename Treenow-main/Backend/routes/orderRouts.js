import express from 'express';
import Order from '../models/orders.js';
import { protect, admin } from '../Midileware/authMiddleware.js';
const router = express.Router();

// Create new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const order = new Order({ user: req.user._id, items, totalAmount });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order' });
  }
});
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user orders' });
  }
});


// Get all orders (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});
router.put('/', protect, admin, async (req, res) => {
  try {
    const updatedBonsai = await Bonsai.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBonsai) {
      return res.status(404).json({ message: 'Bonsai not found' });
    }

    res.json(updatedBonsai);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
