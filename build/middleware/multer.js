"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _multer = _interopRequireDefault(require("multer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _multer.default)({
  storage: _multer.default.diskStorage({}),
  // limits: { fileSize: 200 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/jpeg|jpg|png|gif$i/)) {
      callback('File is not supported', false);
      return;
    }

    callback(null, true);
  }
});

exports.default = _default;
//# sourceMappingURL=multer.js.map