import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

const generateToken = async (payload) => {
  const token = await jwt.sign(payload, jwtSecret, { expiresIn: 3600 });
  return token;
};

export default generateToken;
