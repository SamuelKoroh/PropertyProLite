"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _deaType = require("../../controllers/dea-type");

var _authenticate = _interopRequireWildcard(require("../../middleware/authenticate"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.post('/deals', [_authenticate.default, _authenticate.isAdmin], _deaType.addPropertyDeal);
router.get('/deals', [_authenticate.default, _authenticate.isAdmin], _deaType.getAllPropertyDeals);
router.get('/deals/:id', [_authenticate.default, _authenticate.isAdmin], _deaType.getPropertyDeal);
router.patch('/deals/:id', [_authenticate.default, _authenticate.isAdmin], _deaType.updatePropertyDeal);
router.delete('/deals/:id', [_authenticate.default, _authenticate.isAdmin], _deaType.deletePropertyDeal);
router.post('/types', [_authenticate.default, _authenticate.isAdmin], _deaType.addPropertyTypes);
router.get('/types', [_authenticate.default, _authenticate.isAdmin], _deaType.getAllPropertyTypes);
router.get('/types/:id', [_authenticate.default, _authenticate.isAdmin], _deaType.getPropertyType);
router.patch('/types/:id', [_authenticate.default, _authenticate.isAdmin], _deaType.updatePropertyType);
router.delete('/types/:id', [_authenticate.default, _authenticate.isAdmin], _deaType.deletePropertyType);
var _default = router;
exports.default = _default;
//# sourceMappingURL=index.js.map