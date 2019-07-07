import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';
/**
 * middleware to authorization
 * verify id header have a token
 * verify token
 */
export default async (req, res, next) => {
  // verify if header have a token
  const authHeader = req.headers.authorization;
  if (!authHeader){
    return res.status(401).json({ error: 'Token not provided' });
  }
  // if header have a token, split bearer at token
  const [, token] = authHeader.split(' ');

  // try decod token, verify if token is equal user token secret
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' })
  }
};
