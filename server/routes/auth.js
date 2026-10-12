const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (u) => ({
  token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: { id: u._id, name: u.name, email: u.email, role: u.role, orgName: u.orgName, isVerified: u.isVerified },
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, orgName, phone, city } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (!['donor', 'ngo'].includes(role)) return res.status(400).json({ message: 'Choose donor or NGO' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'This email is already registered' });
    const user = await User.create({ name, email, role, orgName, phone, city, password: await bcrypt.hash(password, 10) });
    res.status(201).json(sign(user));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: (req.body.email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
    return res.status(400).json({ message: 'Email or password is incorrect' });
  res.json(sign(user));
});

router.get('/me', protect, (req, res) => res.json(sign(req.user).user));
module.exports = router;
