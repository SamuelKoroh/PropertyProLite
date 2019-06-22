import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

const authenticate = (req, res) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ status: 'error', error: 'Access Denied - No token provided' });

    const payload = jwt.verify(token, jwtSecret);
    return res.send(payload);
  } catch (error) {
    res.status(400).json({ status: 'error', error: 'Invalid token' });
  }
};
export default authenticate;
