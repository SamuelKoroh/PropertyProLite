import cloudinary from 'cloudinary';

export const okResponse = (res, data, code = 200) => {
  return res.status(code).json({ status: 'success', data });
};

export const badRequest = (res, msg, code = 404) => {
  return res.status(code).json({ status: 'error', error: msg });
};

export const setUserImage = async (file, curVal) => {
  let imageURL = curVal;
  if (file) {
    const result = await cloudinary.v2.uploader.upload(file.path);
    imageURL = result.secure_url;
  }
  return imageURL;
};
