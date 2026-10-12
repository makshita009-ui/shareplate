const router = require('express').Router();
const Donation = require('../models/Donation');
const { protect, role } = require('../middleware/auth');

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const HIDDEN = '-address.street -contactPhone -pickupInstructions'; // unlocked after claiming

// Browse available food (exact address and phone stay hidden until claimed)
router.get('/', protect, async (req, res) => {
  const q = { status: 'available', expiryTime: { $gt: new Date() } };
  if (req.query.city) q['address.city'] = new RegExp(esc(req.query.city), 'i');
  if (req.query.area) q['address.area'] = new RegExp(esc(req.query.area), 'i');
  res.json(await Donation.find(q).select(HIDDEN).populate('donor', 'name orgName isVerified').sort('expiryTime'));
});

// My donations (donor) or my claimed pickups (NGO)
router.get('/mine', protect, async (req, res) => {
  const q = req.user.role === 'ngo' ? { claimedBy: req.user._id } : { donor: req.user._id };
  res.json(await Donation.find(q).populate('donor', 'name phone').populate('claimedBy', 'name orgName phone').sort('-createdAt'));
});

router.post('/', protect, role('donor'), async (req, res) => {
  try {
    const { foodType, description, servings, preparedTime, expiryTime, address, contactPhone, pickupInstructions } = req.body;
    res.status(201).json(await Donation.create({ foodType, description, servings, preparedTime, expiryTime, address, contactPhone, pickupInstructions, donor: req.user._id }));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.patch('/:id/claim', protect, role('ngo'), async (req, res) => {
  if (!req.user.isVerified) return res.status(403).json({ message: 'Your NGO is waiting for admin verification' });
  const d = await Donation.findOneAndUpdate(
    { _id: req.params.id, status: 'available', expiryTime: { $gt: new Date() } },
    { status: 'claimed', claimedBy: req.user._id }, { new: true }
  ).populate('donor', 'name phone');
  if (!d) return res.status(400).json({ message: 'Sorry, this food was just claimed or has expired' });
  res.json(d);
});

router.patch('/:id/collect', protect, role('ngo'), async (req, res) => {
  const d = await Donation.findOneAndUpdate(
    { _id: req.params.id, claimedBy: req.user._id, status: 'claimed' },
    { status: 'collected', collectedAt: new Date() }, { new: true });
  if (!d) return res.status(400).json({ message: 'Cannot mark this pickup as collected' });
  res.json(d);
});

router.patch('/:id/cancel', protect, role('donor'), async (req, res) => {
  const d = await Donation.findOneAndUpdate(
    { _id: req.params.id, donor: req.user._id, status: 'available' }, { status: 'cancelled' }, { new: true });
  if (!d) return res.status(400).json({ message: 'Only available food can be cancelled' });
  res.json(d);
});

module.exports = router;
