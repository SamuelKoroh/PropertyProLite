"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = _interopRequireDefault(require("./auth"));

var _property = _interopRequireDefault(require("./property"));

var _flag = _interopRequireDefault(require("./flag"));

var _users = _interopRequireDefault(require("./users"));

var _favourites = _interopRequireDefault(require("./favourites"));

var _dealType = _interopRequireDefault(require("./deal-type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = (0, _express.default)();
routes.use('/auth', _auth.default);
routes.use('/property', _property.default);
routes.use('/users', _users.default);
routes.use('/flag', _flag.default);
routes.use('/favourites', _favourites.default);
routes.use('/deals-types', _dealType.default);
var _default = routes;
exports.default = _default;