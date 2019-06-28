"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cloudinary = _interopRequireDefault(require("cloudinary"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const uploadImages = async files => {
  const result = {};

  try {
    const imagePromises = files.map(file => new Promise((resolve, reject) => {
      _cloudinary.default.v2.uploader.upload(file.path, {
        use_filename: true,
        unique_fileName: false
      }, (error, res) => {
        if (error) reject(error);else resolve(res.secure_url);
      });
    }));
    result.images = await Promise.all(imagePromises);
  } catch (error) {
    result.errors = error;
  }

  return result;
};

var _default = uploadImages;
exports.default = _default;
//# sourceMappingURL=upload-files.js.map