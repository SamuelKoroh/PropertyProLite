import jwt from 'jsonwebtoken';
import { badRequest } from '../utils/refractory';

const jwtSecret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token) return badRequest(res, 'Access Denied - No token provided', 401);

    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    return badRequest(res, 'Invalid token', 400);
  }
};

const isAgent = (req, res, next) => {
  if (req.user.user_type.toString() !== 'agent' && req.user.is_admin === false)
    return badRequest(res, 'Access Forbidden', 403);
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.is_admin === false) return badRequest(res, 'Access Forbidden', 403);
  next();
};

export { isAgent, isAdmin };
export default authenticate;
