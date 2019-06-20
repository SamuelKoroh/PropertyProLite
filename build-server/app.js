"use strict";

var _express = _interopRequireDefault(require("express"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.get('/', function (req, res) {
  res.send('It is working test');
});
app.use('/api/v1', _routes["default"]);
var port = process.env.PORT || 3500;
app.listen(port, function () {
  return console.log("Server listening on ".concat(port));
});