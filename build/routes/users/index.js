"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _multer = _interopRequireDefault(require("../../middleware/multer"));

var _authenticate = _interopRequireWildcard(require("../../middleware/authenticate"));

var _users = require("../../controllers/users");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.get('/', [_authenticate.default, _authenticate.isAdmin], _users.getAllUser);
router.get('/me', _authenticate.default, _users.getUserProfile);
router.get('/:userId', _users.getUserProperties);
router.patch('/:userId', [_authenticate.default, _multer.default.single('image')], _users.updateUserProfile);
router.delete('/:userId', [_authenticate.default, _authenticate.isAdmin], _users.deleteUserProfile);
router.patch('/:userId/activate', [_authenticate.default, _authenticate.isAdmin], _users.activateDeactivateUserProfile);
var _default = router;
exports.default = _default;
//# sourceMappingURL=index.js.map