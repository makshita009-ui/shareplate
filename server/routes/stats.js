const router = require('express').Router();
const Donation = require('../models/Donation');
const KG_PER_MEAL = 0.4; // simple estimate used for the impact dashboard

router.get('/', async (req, res) => {
  const done = await Donation.find({ status: 'collected' }).select('servings address.city');
  const meals = done.reduce((s, d) => s + d.servings, 0);
  const byCity = {};
  done.forEach((d) => { const c = d.address.city; byCity[c] = (byCity[c] || 0) + d.servings; });
  res.json({
    meals, pickups: done.length,
    kgRescued: +(meals * KG_PER_MEAL).toFixed(1),
    co2Saved: +(meals * KG_PER_MEAL * 2.5).toFixed(1),
    activeNow: await Donation.countDocuments({ status: 'available', expiryTime: { $gt: new Date() } }),
    byCity: Object.entries(byCity).map(([city, meals]) => ({ city, meals })).sort((a, b) => b.meals - a.meals).slice(0, 6),
  });
});
module.exports = router;
