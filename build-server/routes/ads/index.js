"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express["default"])();
var Ads = [{
  id: 1,
  name: '2 bedroom in lagos'
}, {
  id: 2,
  name: 'self contain flat'
}, {
  id: 3,
  name: 'nice toilet and files'
}];
router.get('/', function (req, res) {
  res.status(200).json(Ads);
});
var _default = router;
exports["default"] = _default;