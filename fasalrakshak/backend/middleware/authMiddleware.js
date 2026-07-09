import jwt from 'jsonwebtoken';
import Kisan from '../models/Kisan.js';

export const protect = async (req, res, next) => {
  let token;

  // Check cookies first
  if (req.cookies && req.cookies.fasal_token) {
    token = req.cookies.fasal_token;
  } 
  // Fallback to headers
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    if (process.env.NODE_ENV === 'development') console.log('[AUTH] No token provided in headers or cookies.');
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    if (process.env.NODE_ENV === 'development') console.log(`[AUTH] Verifying token: ${token.substring(0, 15)}...`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (process.env.NODE_ENV === 'development') console.log(`[AUTH] Token decoded, finding user ID: ${decoded.id}`);
    req.user = await Kisan.findById(decoded.id).select('-pin');
    
    if (!req.user) {
      if (process.env.NODE_ENV === 'development') console.log(`[AUTH] User not found for ID: ${decoded.id}`);
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (process.env.NODE_ENV === 'development') console.log(`[AUTH] User authenticated successfully: ${req.user.name} (${req.user.mobile})`);

    next();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      if (!process.env.JWT_SECRET) {
        console.error('Auth Error: Missing JWT_SECRET configuration');
      } else {
        console.error(`Auth Error: ${error.name} - ${error.message}`);
      }
    }
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
