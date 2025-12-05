import { verifyAccessToken } from '../utilities/jwt.js';
import Admin from '../models/admin.js';

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyAccessToken(token);

    // Fetch admin from DB to verify active status and tokenVersion
    const admin = await Admin.findById(decoded.sub);
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is disabled' 
      });
    }

    if (decoded.tokenVersion !== admin.tokenVersion) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has been invalidated' 
      });
    }

    // Attach user to request
    req.user = {
      id: admin._id,
      role: admin.role
    };

    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Role-based access control
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

export { authenticate, requireRole };