import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ status: 'error', error: 'Access Denied - No token provided' });

    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    return res.status(400).json({ status: 'error', error: 'Invalid token' });
  }
};

const isAgent = (req, res, next) => {
  if (req.user.user_type.toString() !== 'agent' && req.user.is_admin === false)
    return res.status(403).json({ status: 'error', error: 'Access Forbidden' });

  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.is_admin === false)
    return res.status(403).json({ status: 'error', error: 'Access Forbidden' });

  next();
};

export { isAgent, isAdmin };
export default authenticate;
