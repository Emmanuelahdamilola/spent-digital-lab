
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const generateAccessToken = (adminId, role, tokenVersion) => {
  return jwt.sign({
    sub: adminId,
    role,
    tokenVersion
  }, config.jwt_secret, { expiresIn: config.jwt_access_expiry });
}

const generateRefreshToken = (adminId, tokenVersion) => {
  return jwt.sign({
    sub: adminId,
    tokenVersion
  }, config.jwt_refresh_secret, { expiresIn: config.jwt_refresh_expiry })
}

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt_secret);  
  } catch (err) {
    throw new Error('Invalid or expired access token');
  }
}

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt_refresh_secret);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};


export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}