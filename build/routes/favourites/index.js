"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _favourites = require("../../controllers/favourites");

var _authenticate = _interopRequireDefault(require("../../middleware/authenticate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.post('/:propertyId', _authenticate.default, _favourites.saveFavourites);
router.get('/', _authenticate.default, _favourites.getFavourites);
router.delete('/:favouriteId', _authenticate.default, _favourites.deleteFavourite);
var _default = router;
exports.default = _default;
//# sourceMappingURL=index.js.map