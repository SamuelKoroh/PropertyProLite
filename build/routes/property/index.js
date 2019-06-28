"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _authenticate = _interopRequireWildcard(require("../../middleware/authenticate"));

var _multer = _interopRequireDefault(require("../../middleware/multer"));

var _property = require("../../controllers/property");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { isAgent, isAdmin} from '../../middleware/authenticate';
const router = _express.default.Router();

router.post('/', [_authenticate.default, _authenticate.isAgent, _multer.default.array('images')], _property.createProperty);
router.patch('/:propertyId/sold', [_authenticate.default, _authenticate.isAgent], _property.updatePropertyAsSold);
router.patch('/:propertyId', [_authenticate.default, _authenticate.isAgent, _multer.default.array('images')], _property.updateProperty);
router.patch('/:propertyId/activate', [_authenticate.default, _authenticate.isAdmin], _property.activateDeactivateAdvaert);
router.delete('/:propertyId', [_authenticate.default, _authenticate.isAgent], _property.deleteProperty);
router.get('/:propertyId', _property.getProperty);
router.get('/', _property.getProperties);
var _default = router;
exports.default = _default;
//# sourceMappingURL=index.js.map