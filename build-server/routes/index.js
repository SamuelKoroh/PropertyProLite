"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _users = _interopRequireDefault(require("./users"));

var _ads = _interopRequireDefault(require("./ads"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var routes = (0, _express["default"])();
routes.use('/users', _users["default"]);
routes.use('/ads', _ads["default"]);
var _default = routes;
exports["default"] = _default;