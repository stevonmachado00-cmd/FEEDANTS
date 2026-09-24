require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const bcrypt = require('bcryptjs');

const connectDB = require('../config/db');

const seed = async () => {
  await connectDB();
  
  try {
    // 2. Clear existing data
    await User.deleteMany();
    await Competition.deleteMany();
    await Registration.deleteMany();

    // 3. Create a test user
    const user = await User.create({
      username: 'testuser',
      name: 'Test User',
      email: 'test@feedants.com',
      password: 'Test@1234'
    });

    const now = new Date();
    
    // 4. Create the exact competition
    const competition = await Competition.create({
      title: 'Feedants Classical Dance',
      categories: ['Dance', 'Multi-Win'],
      highlights: ['Winners get certificate'],
      prizePool: 1500,
      entryFee: 99,
      totalSpots: 20,
      bookedSpots: 1,
      judge: {
        name: 'Manju Dubey',
        title: 'Professional Kathak Dancer',
        experience: '12+ Years',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        introVideoUrl: ''
      },
      timeline: {
        registrationDeadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        submissionStart: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        submissionEnd: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        resultDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
      },
      rewards: [
        { position: 1, label: '1st Prize', amount: 550, icon: 'gold' },
        { position: 2, label: '2nd Prize', amount: 300, icon: 'silver' },
        { position: 3, label: '3rd Prize', amount: 240, icon: 'bronze' },
        { position: 4, label: '4th Prize', amount: 200, icon: 'medal' },
        { position: 5, label: '5th Prize', amount: 130, icon: 'medal' },
        { position: 6, label: '6th Prize', amount: 80, icon: 'medal' }
      ],
      previousWinners: [
        { name: 'Riya Shah', rank: '1st', avatarUrl: 'https://i.pravatar.cc/150?img=2', hasVideo: true },
        { name: 'Aarav Mehta', rank: '1st', avatarUrl: 'https://i.pravatar.cc/150?img=3', hasVideo: false },
        { name: 'Neha Verma', rank: '2nd', avatarUrl: 'https://i.pravatar.cc/150?img=4', hasVideo: true },
        { name: 'Ishita Chauhan', rank: '3rd', avatarUrl: 'https://i.pravatar.cc/150?img=5', hasVideo: false }
      ],
      details: {
        about: 'Join the most prestigious classical dance competition. Show your skills and win amazing prizes.',
        judgingParameters: 'Expression, Rhythm, Posture, Choreography.',
        rulesAndEligibility: 'Open to all ages. Video must be unedited.'
      },
      status: 'registration_open'
    });

    // 5. Create one registration
    await Registration.create({
      userId: user._id,
      competitionId: competition._id,
      paidAmount: competition.entryFee,
      status: 'registered'
    });

    console.log('Seed Data Inserted Successfully');
    console.log('Test User:', user.email);
    console.log('Competition ID:', competition._id);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seed();
