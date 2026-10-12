const router = require('express').Router();
const User = require('../models/User');
const { protect, role } = require('../middleware/auth');

router.use(protect, role('admin'));
router.get('/users', async (req, res) => res.json(await User.find({ role: { $ne: 'admin' } }).select('-password').sort('isVerified -createdAt')));
router.patch('/users/:id/verify', async (req, res) =>
  res.json(await User.findByIdAndUpdate(req.params.id, { isVerified: req.body.isVerified }, { new: true }).select('-password')));
module.exports = router;
