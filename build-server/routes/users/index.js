"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express["default"])();
var Users = [{
  id: 1,
  name: 'Samuel'
}, {
  id: 2,
  name: 'Godwin'
}, {
  id: 3,
  name: 'Kimi'
}, {
  id: 4,
  name: 'Bebe'
}, {
  id: 5,
  name: 'Dubem'
}, {
  id: 6,
  name: 'Augustine'
}];
router.get('/', function (req, res) {
  res.status(200).json(Users);
});
var _default = router;
exports["default"] = _default;