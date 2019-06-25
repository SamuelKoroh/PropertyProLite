export const okResponse = (res, data, code = 200) => {
  return res.status(code).json({ status: 'success', data });
};

export const badRequest = (res, msg, code = 404) => {
  return res.status(code).json({ status: 'error', error: msg });
};
