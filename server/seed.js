// Run once: npm run seed  -> creates the admin account
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@shareplate.com';
  if (await User.findOne({ email })) console.log('Admin already exists');
  else {
    await User.create({ name: 'Admin', email, role: 'admin', isVerified: true,
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10) });
    console.log('Admin created:', email);
  }
  process.exit();
})();
