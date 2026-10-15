
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Profile = require('../models/Profile');

dotenv.config();

const demoUsers = [
  {
    name: 'System Admin',
    email: 'admin@college.edu',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah.alumni@techcorp.com',
    password: 'Alumni@123',
    role: 'alumni',
  },
  {
    name: 'Alex Johnson',
    email: 'alex.student@college.edu',
    password: 'Student@123',
    role: 'student',
  },
];

async function runSeed() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not configured');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas');

    for (const data of demoUsers) {
      let user = await User.findOne({
        email: data.email.toLowerCase(),
      }).select('+password');

      if (user) {
        console.log(`User already exists: ${data.email}`);
        continue;
      }

      user = await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      await Profile.create({
        user: user._id,
        department: 'Computer Science & Engineering',
        graduationYear: data.role === 'student' ? 2026 : 2020,
        domain: 'Software Engineering',
      });

      console.log(`Created demo account: ${data.email}`);
    }

    console.log('Demo account setup completed');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

runSeed();
