"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _flag = require("../../controllers/flag");

var _authenticate = _interopRequireWildcard(require("../../middleware/authenticate"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.post('/', _flag.flagAdd);
router.get('/:flagId', [_authenticate.default, _authenticate.isAdmin], _flag.getFlagById);
router.get('/', [_authenticate.default, _authenticate.isAdmin], _flag.getAllFlags);
router.delete('/:flagId', [_authenticate.default, _authenticate.isAdmin], _flag.deleteFlag);
var _default = router;
exports.default = _default;