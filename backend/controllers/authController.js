const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET || 'feedants_access_secret_key_dev_2026',
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'feedants_refresh_secret_key_dev_2026',
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
  return { accessToken, refreshToken };
};

// In-memory demo registered users storage
const inMemoryUsers = new Map();

exports.signup = async (req, res, next) => {
  try {
    const { username, password, name, email } = req.body;

    const rawUsername = username || email?.split('@')[0];
    if (!rawUsername || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const cleanUsername = rawUsername.trim().toLowerCase();

    // Check if user exists in MongoDB
    try {
      const existingUser = await User.findOne({
        $or: [{ username: cleanUsername }, { email: email?.toLowerCase() || '' }],
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Username already in use. Please choose another or log in.',
        });
      }

      const user = await User.create({
        username: cleanUsername,
        name: name || cleanUsername,
        email: email || `${cleanUsername}@feedants.local`,
        password,
      });

      const { accessToken, refreshToken } = generateTokens(user._id);

      const salt = await bcrypt.genSalt(10);
      user.refreshToken = await bcrypt.hash(refreshToken, salt);
      await user.save({ validateBeforeSave: false });

      // Mirror in-memory for resilience
      inMemoryUsers.set(cleanUsername, {
        id: user._id.toString(),
        username: cleanUsername,
        password,
        name: user.name,
      });

      return res.status(201).json({
        success: true,
        tokens: { accessToken, refreshToken },
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
        },
      });
    } catch (dbErr) {
      // In-Memory Fallback if DB is unavailable
      if (inMemoryUsers.has(cleanUsername)) {
        return res.status(409).json({
          success: false,
          message: 'Username already in use. Please choose another or log in.',
        });
      }

      const mockId = 'usr_' + Date.now();
      const mockUser = {
        id: mockId,
        username: cleanUsername,
        name: name || cleanUsername,
        email: email || `${cleanUsername}@feedants.local`,
        password,
      };
      inMemoryUsers.set(cleanUsername, mockUser);

      const { accessToken, refreshToken } = generateTokens(mockId);
      return res.status(201).json({
        success: true,
        tokens: { accessToken, refreshToken },
        user: {
          id: mockUser.id,
          username: mockUser.username,
          name: mockUser.name,
          email: mockUser.email,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const identifier = (username || email || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    }

    let user = null;
    try {
      user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }],
      }).select('+password +refreshToken');
    } catch (dbErr) {}

    // 1. Check MongoDB
    if (user) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect password.',
        });
      }

      const { accessToken, refreshToken } = generateTokens(user._id);
      const salt = await bcrypt.genSalt(10);
      user.refreshToken = await bcrypt.hash(refreshToken, salt);
      await user.save({ validateBeforeSave: false });

      return res.status(200).json({
        success: true,
        tokens: { accessToken, refreshToken },
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
        },
      });
    }

    // 2. Check In-Memory registered accounts
    if (inMemoryUsers.has(identifier)) {
      const memUser = inMemoryUsers.get(identifier);
      if (memUser.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect password.',
        });
      }

      const { accessToken, refreshToken } = generateTokens(memUser.id);
      return res.status(200).json({
        success: true,
        tokens: { accessToken, refreshToken },
        user: {
          id: memUser.id,
          username: memUser.username,
          name: memUser.name,
          email: memUser.email,
        },
      });
    }

    // 3. User does NOT exist
    return res.status(404).json({
      success: false,
      message: 'Account does not exist. Please register first.',
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    const secret = process.env.JWT_REFRESH_SECRET || 'feedants_refresh_secret_key_dev_2026';
    const decoded = jwt.verify(token, secret);
    const tokens = generateTokens(decoded.id);

    res.status(200).json({
      success: true,
      tokens,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user?.id) {
      try {
        const user = await User.findById(req.user.id);
        if (user) {
          user.refreshToken = undefined;
          await user.save({ validateBeforeSave: false });
        }
      } catch (e) {}
    }
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
