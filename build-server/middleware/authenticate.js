"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.isAdmin = exports.isAgent = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jwtSecret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({
      status: 'error',
      error: 'Access Denied - No token provided'
    });
    req.user = _jsonwebtoken.default.verify(token, jwtSecret);
    next();
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      error: 'Invalid token'
    });
  }
};

const isAgent = (req, res, next) => {
  if (req.user.user_type.toString() !== 'agent' && req.user.is_admin === false) return res.status(403).json({
    status: 'error',
    error: 'Access Forbidden'
  });
  next();
};

exports.isAgent = isAgent;

const isAdmin = (req, res, next) => {
  if (req.user.is_admin === false) return res.status(403).json({
    status: 'error',
    error: 'Access Forbidden'
  });
  next();
};

exports.isAdmin = isAdmin;
var _default = authenticate;
exports.default = _default;