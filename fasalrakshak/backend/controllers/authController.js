import Kisan from '../models/Kisan.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Create cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
});

// Dictionary to track failed login attempts for rate limiting (in memory, simplified)
const failedAttempts = new Map();

export const signup = async (req, res) => {
  try {
    const { name, mobile, pin, gender, village, district, state, cropTypes, landSize } = req.body;

    // Validate required fields
    if (!name || !mobile || !pin || !gender || !village || !district) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    // Check if mobile already exists
    const existingKisan = await Kisan.findOne({ mobile });
    if (existingKisan) {
      return res.status(409).json({ success: false, message: 'Mobile number already registered' });
    }

    // Hash PIN
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);

    // Save new Kisan
    const kisan = await Kisan.create({
      name,
      mobile,
      pin: hashedPin,
      gender,
      village,
      district,
      state: state || 'Gujarat',
      cropTypes: cropTypes || [],
      landSize: landSize || ''
    });

    // Generate token
    const token = generateToken({ id: kisan._id, name: kisan.name, mobile: kisan.mobile, gender: kisan.gender });

    // Set cookie
    res.cookie('fasal_token', token, getCookieOptions());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: kisan._id,
        name: kisan.name,
        mobile: kisan.mobile,
        gender: kisan.gender,
        village: kisan.village,
        loginTime: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

export const login = async (req, res) => {
  try {
    const { mobile, pin } = req.body;

    if (!mobile || !pin) {
      return res.status(400).json({ success: false, message: 'Mobile and PIN are required' });
    }

    // Rate limiting check
    const attemptsInfo = failedAttempts.get(mobile);
    if (attemptsInfo && attemptsInfo.count >= 5) {
      const timeSinceLastAttempt = Date.now() - attemptsInfo.lastAttempt;
      if (timeSinceLastAttempt < 30 * 60 * 1000) { // Lock for 30 minutes
        return res.status(429).json({
          success: false,
          message: 'Too many failed attempts. Please try after 30 minutes.'
        });
      } else {
        // Reset after 30 mins
        failedAttempts.delete(mobile);
      }
    }

    // Validate mobile format
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Invalid mobile number format' });
    }

    // Find kisan
    const kisan = await Kisan.findOne({ mobile });
    if (!kisan) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
    }

    // Compare PIN
    const isMatch = await bcrypt.compare(pin, kisan.pin);
    if (!isMatch) {
      // Record failed attempt
      const attempts = (failedAttempts.get(mobile)?.count || 0) + 1;
      failedAttempts.set(mobile, { count: attempts, lastAttempt: Date.now() });

      return res.status(401).json({ success: false, message: 'Incorrect mobile or PIN. Please try again.' });
    }

    // Reset failed attempts on success
    failedAttempts.delete(mobile);

    // Update lastLoginAt
    kisan.lastLoginAt = Date.now();
    await kisan.save();

    // Generate token
    const token = generateToken({ id: kisan._id, name: kisan.name, mobile: kisan.mobile, gender: kisan.gender });

    // Set cookie
    res.cookie('fasal_token', token, getCookieOptions());

    res.status(200).json({
      success: true,
      token,
      user: {
        id: kisan._id,
        name: kisan.name,
        mobile: kisan.mobile,
        gender: kisan.gender,
        village: kisan.village,
        loginTime: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    let token = req.cookies.fasal_token;
    
    // Fallback to Authorization header if no cookie
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user excluding pin
    const kisan = await Kisan.findById(decoded.id).select('-pin');
    
    if (!kisan) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: kisan._id,
        name: kisan.name,
        mobile: kisan.mobile,
        gender: kisan.gender,
        village: kisan.village,
        loginTime: new Date().toISOString()
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      if (!process.env.JWT_SECRET) {
        console.error('Me Error: Missing JWT_SECRET configuration');
      } else {
        console.error(`Me Error: ${error.name} - ${error.message}`);
      }
    }
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

export const logout = async (req, res) => {
  res.cookie('fasal_token', 'none', {
    expires: new Date(0),
    httpOnly: true,
  });
  
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
