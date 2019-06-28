"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteProperty = exports.activateDeactivateAdvaert = exports.updatePropertyAsSold = exports.updateProperty = exports.getProperty = exports.getProperties = exports.createProperty = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _uploadFiles = _interopRequireDefault(require("../utils/upload-files"));

var _Properties = _interopRequireDefault(require("../models/Properties"));

var _Users = _interopRequireDefault(require("../models/Users"));

var _modelValidation = require("../middleware/modelValidation");

var _refractory = require("../utils/refractory");

var _date = _interopRequireDefault(require("../utils/date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ///////////////////////////////////////////////////////////////////

/* This region is for code refractory
@@ Description    To refractor owner property retrieve from the database
*/
const getOwnerProperty = (property, owner) => {
  return { ...property,
    owner: owner.first_name.concat(' ', owner.last_name),
    ownerEmail: owner.email,
    ownerPhoneNumber: owner.phone_number
  };
};
/*
@@ Description    Revoke user ffrom changing the state of a property if not it's owner
*/


const revokeAccess = res => {
  return (0, _refractory.badRequest)(res, 'You are not allow to perform this operation', 403);
};

const filterProperties = (properties, type, deal, price, location) => {
  let result = properties;
  if (type) result = result.filter(p => p.title.toLowerCase().startsWith(type.toLowerCase()));
  if (deal) result = result.filter(p => p.deal_type.toLowerCase() === deal.toLowerCase());
  if (price) result = result.filter(p => parseInt(p.price, 10) <= parseInt(price, 10));
  if (location) result = result.filter(p => p.state.toLowerCase().startsWith(location.toLowerCase()) || p.city.toLowerCase().startsWith(location.toLowerCase()) || p.address.toLowerCase().startsWith(location.toLowerCase()));
  return result;
};
/*
@@ end of refractory
*/
// ///////////////////////////////////////////////////////////////////////////

/*
@@ Route          /api/v1/property
@@ Method         POST
@@ Description    Create a property ad.
*/


const createProperty = async ({
  user,
  files,
  body
}, res) => {
  try {
    const errors = _joi.default.validate(body, _modelValidation.createPropertySchema);

    if (errors.error) return (0, _refractory.badRequest)(res, errors, 400);

    let property = _Properties.default.find(prop => prop.title.toLowerCase() === body.title.toLowerCase());

    if (property && property.owner === user.id) return (0, _refractory.badRequest)(res, 'This property already exists', 400);
    property = {
      id: _Properties.default.length + 1,
      ...body,
      owner: user.id,
      status: 'available',
      is_active: true,
      created_on: (0, _date.default)()
    };

    if (files) {
      const result = await (0, _uploadFiles.default)(files);
      property.image_url = result.images;
    }

    _Properties.default.push(property);

    return (0, _refractory.okResponse)(res, property, 201);
  } catch (error) {
    (0, _refractory.badRequest)(res, 'Server Error', 500);
  }
};
/*
@@ Route          /api/v1//property/
@@ Route          /api/v1//property/?type=val&price=val&location=val&deal=val
@@ Method         GET
@@ Description    Get all property adverts.
*/


exports.createProperty = createProperty;

const getProperties = (req, res) => {
  const {
    location,
    type,
    deal,
    price
  } = req.query;

  let properties = _Properties.default.filter(p => p.status !== 'sold');

  properties = filterProperties(properties, type, deal, price, location);
  if (!properties.length) return (0, _refractory.badRequest)(res, 'No property was found');
  properties = properties.map(property => {
    const owner = _Users.default.find(u => u.id === property.owner);

    return getOwnerProperty(property, owner);
  });
  (0, _refractory.okResponse)(res, properties);
};
/*
@@ Route          /api/v1//property/:propertyId
@@ Method         GET
@@ Description    Get all property adverts.
*/


exports.getProperties = getProperties;

const getProperty = ({
  params
}, res) => {
  const property = _Properties.default.find(prop => parseInt(prop.id, 10) === parseInt(params.propertyId, 10) && prop.status !== 'sold');

  if (!property) return (0, _refractory.badRequest)(res, 'The property does not exist');

  const owner = _Users.default.find(u => u.id === property.owner);

  const data = getOwnerProperty(property, owner);
  (0, _refractory.okResponse)(res, data);
};
/*
@@ Route          /api/v1//property/:propertyId
@@ Method         PATCH
@@ Description    Update a property advert.
*/


exports.getProperty = getProperty;

const updateProperty = async ({
  params,
  body,
  files,
  user
}, res) => {
  const property = _Properties.default.find(prop => parseInt(prop.id, 10) === parseInt(params.propertyId, 10));

  if (!property) return (0, _refractory.badRequest)(res, 'The property does not exist');
  if (property.owner !== user.id && user.is_admin === false) return revokeAccess(res);
  const keys = Object.keys(body);
  keys.forEach(key => {
    property[key] = body[key];
  });

  if (files) {
    const result = await (0, _uploadFiles.default)(files);
    property.image_url = result.images;
  }

  (0, _refractory.okResponse)(res, property);
};
/*
@@ Route          /api/v1//property/:propertyId/sold
@@ Method         PATCH
@@ Description    Update a property advert mark status as sold.
*/


exports.updateProperty = updateProperty;

const updatePropertyAsSold = ({
  params,
  user
}, res) => {
  const property = _Properties.default.find(prop => parseInt(prop.id, 10) === parseInt(params.propertyId, 10));

  if (!property) return (0, _refractory.badRequest)(res, 'The property does not exist');
  if (property.owner !== user.id && user.is_admin === false) return revokeAccess(res);
  property.status = 'sold';
  (0, _refractory.okResponse)(res, property);
};
/*
@@ Route          /api/v1/property/:propertyId/activate
@@ Method         PATCH
@@ Description    Activate user account
*/


exports.updatePropertyAsSold = updatePropertyAsSold;

const activateDeactivateAdvaert = ({
  params
}, res) => {
  const property = _Properties.default.find(p => parseInt(p.id, 10) === parseInt(params.propertyId, 10));

  if (!property) return (0, _refractory.badRequest)(res, 'The property advert does not exist');
  property.is_active = !property.is_active;
  (0, _refractory.okResponse)(res, property);
};
/*
@@ Route          /api/v1//property/:propertyId
@@ Method         DELETE
@@ Description    Delete a property advert.
*/


exports.activateDeactivateAdvaert = activateDeactivateAdvaert;

const deleteProperty = ({
  params,
  user
}, res) => {
  const property = _Properties.default.find(prop => parseInt(prop.id, 10) === parseInt(params.propertyId, 10));

  if (!property) return (0, _refractory.badRequest)(res, 'The property does not exist');
  if (property.owner !== user.id && user.is_admin === false) return revokeAccess(res);

  const index = _Properties.default.indexOf(property);

  _Properties.default.splice(index, 1);

  (0, _refractory.okResponse)(res, {
    message: 'The property has been removed'
  });
};

exports.deleteProperty = deleteProperty;
//# sourceMappingURL=property.js.map