export const okResponse = (res, data, code = 200) => {
  return res.status(code).json({ status: 'success', data });
};

export const badRequest = (res, msg, code = 404) => {
  return res.status(code).json({ status: 'error', error: msg });
};

export const removeItem = (Collection, params, res) => {
  const item = Collection.find(p => parseInt(p.id, 10) === parseInt(params.id, 10));
  if (!item) return badRequest(res, 'The item does not exist');
  const index = Collection.indexOf(item);
  Collection.splice(index, 1);
  okResponse(res, { message: 'The item has been removed' });
};
export const updateItem = (Collection, body, params, res) => {
  const item = Collection.find(p => parseInt(p.id, 10) === parseInt(params.id, 10));
  if (!item) return badRequest(res, 'The item does not exist');
  const keys = Object.keys(body);
  keys.forEach((key) => {
    item[key] = body[key];
  });
  okResponse(res, item);
};
export const getItem = (Collection, params, res) => {
  const item = Collection.find(p => parseInt(p.id, 10) === parseInt(params.id, 10));
  if (!item) return badRequest(res, 'The item does not exist');
  okResponse(res, item);
};
export const addItem = (Collection, body, res) => {
  const item = { id: Collection.length + 1, ...body };
  Collection.push(item);
  okResponse(res, item);
};
