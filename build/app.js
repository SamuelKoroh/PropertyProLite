"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _helmet = _interopRequireDefault(require("helmet"));

var _morgan = _interopRequireDefault(require("morgan"));

require("dotenv/config");

var _swagger = _interopRequireDefault(require("./doc/swagger.json"));

var _routes = _interopRequireDefault(require("./routes"));

require("./config/cloudinary");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
app.use((0, _helmet.default)());

if (app.get('env') === 'development') {
  app.use((0, _morgan.default)('dev'));
}

app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
app.use('/api/v1', _routes.default);
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_swagger.default));
var _default = app;
exports.default = _default;
//# sourceMappingURL=app.js.map