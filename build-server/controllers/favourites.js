"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFavourite = exports.getFavourites = exports.saveFavourites = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _Favourites = _interopRequireDefault(require("../models/Favourites"));

var _refractory = require("../utils/refractory");

var _Properties = _interopRequireDefault(require("../models/Properties"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getFavourite = (favouritePropertyId, user) => {
  return _Favourites.default.find(f => parseInt(f.id, 10) === parseInt(favouritePropertyId, 10) && parseInt(f.user_id, 10) === parseInt(user.id, 10) || parseInt(f.property_id, 10) === parseInt(favouritePropertyId, 10) && parseInt(f.user_id, 10) === parseInt(user.id, 10));
};

const removeFavourite = favourite => {
  const index = _Favourites.default.indexOf(favourite);

  _Favourites.default.splice(index, 1);

  return 'The property has been removed';
};

const saveFavourites = ({
  params,
  user
}, res) => {
  const {
    propertyId
  } = params;
  let favourite = getFavourite(propertyId, user);
  if (favourite) return (0, _refractory.okResponse)(res, {
    message: removeFavourite(favourite)
  });
  favourite = {
    id: _Favourites.default.length + 1,
    user_id: user.id,
    property_id: propertyId
  };

  _Favourites.default.push(favourite);

  (0, _refractory.okResponse)(res, {
    message: 'The property has been saved to your favourite list'
  });
};

exports.saveFavourites = saveFavourites;

const getFavourites = ({
  user
}, res) => {
  const favourites = _Favourites.default.filter(f => parseInt(f.user_id, 10) === parseInt(user.id, 10));

  const myFavourites = favourites.map(f => {
    const property = _Properties.default.find(p => parseInt(p.id, 10) === parseInt(f.property_id, 10));

    return {
      favorite_id: f.id,
      property_id: property.id,
      owner_id: property.owner,
      ..._lodash.default.omit(property, ['id', 'owner'])
    };
  });
  (0, _refractory.okResponse)(res, myFavourites);
};

exports.getFavourites = getFavourites;

const deleteFavourite = ({
  params,
  user
}, res) => {
  const favourite = getFavourite(params.favouriteId, user);
  if (!favourite) return (0, _refractory.badRequest)(res, 'The property does not exist', 404);
  (0, _refractory.okResponse)(res, {
    message: removeFavourite(favourite)
  });
};

exports.deleteFavourite = deleteFavourite;