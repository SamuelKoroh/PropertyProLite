"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = require("../../controllers/auth");

var _multer = _interopRequireDefault(require("../../middleware/multer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.post('/signup', _multer.default.single('image'), _auth.signUp);
router.post('/signin', _auth.signIn);
router.post('/reset-password', _auth.sendResetLink);
router.get('/reset-password/:token', _auth.validateUrlToken);
router.patch('/reset-password/:token', _auth.updateUserPassword);
var _default = router;
exports.default = _default;