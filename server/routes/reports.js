const router = require('express').Router();
const Report = require('../models/Report');
const { protect, role } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  if (!req.body.donation || !req.body.message) return res.status(400).json({ message: 'Describe the issue' });
  res.status(201).json(await Report.create({ reporter: req.user._id, donation: req.body.donation, message: req.body.message }));
});
router.get('/', protect, role('admin'), async (req, res) =>
  res.json(await Report.find().populate('reporter', 'name role').populate('donation', 'foodType').sort('-createdAt')));
router.patch('/:id/resolve', protect, role('admin'), async (req, res) =>
  res.json(await Report.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true })));
module.exports = router;
