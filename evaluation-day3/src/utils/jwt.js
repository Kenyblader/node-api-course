import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export const generateToken = (payload) =>{
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
}

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRES_IN });
}

export const verifyToken = ({token, secret}) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}
