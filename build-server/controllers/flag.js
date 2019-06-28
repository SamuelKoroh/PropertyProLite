"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFlag = exports.getFlagById = exports.getAllFlags = exports.flagAdd = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _Flags = _interopRequireDefault(require("../models/Flags"));

var _modelValidation = require("../middleware/modelValidation");

var _Properties = _interopRequireDefault(require("../models/Properties"));

var _Users = _interopRequireDefault(require("../models/Users"));

var _refractory = require("../utils/refractory");

var _date = _interopRequireDefault(require("../utils/date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ///////////////////////////////////////////////////////////////////

/* This region is for code refractory
@@ Description    function to retrieve flags property and owner detail
*/
const noFlag = {
  status: 'error',
  error: 'No flag'
}; // Fuction for finding return a single flag

const findFlag = (flags, params) => {
  return flags.find(f => f.status === 'active' && parseInt(f.id, 10) === parseInt(params.flagId, 10));
}; // Description    function to retrieve flags property and owner detail


const getFlagedUserProperty = flag => {
  const property = _Properties.default.find(p => parseInt(p.id, 10) === parseInt(flag.property_id, 10));

  const {
    first_name: fName,
    last_name: lName,
    id: agentId
  } = _Users.default.find(u => parseInt(u.id, 10) === parseInt(property.owner, 10));

  return { ...flag,
    property: property.title,
    agent_id: agentId,
    agent_name: fName.concat(' ', lName)
  };
}; // Description    function to filtered the list of flags


const filterByQuery = (allFlags, search) => {
  let result = allFlags;
  if (search) result = result.filter(f => f.name.toLocaleLowerCase().startsWith(search.toLocaleLowerCase()) || f.reason.toLocaleLowerCase().startsWith(search.toLocaleLowerCase()) || f.email.toLocaleLowerCase().startsWith(search.toLocaleLowerCase()));
  return result;
};
/*
@@ end of refractory
*/
// ///////////////////////////////////////////////////////////////////////////

/*
@@ Route          /api/v1/flag
@@ Method         POST
@@ Description    Report - flag a property advert.
*/


const flagAdd = ({
  body
}, res) => {
  const errors = _joi.default.validate(body, _modelValidation.flagAddSchema);

  if (errors.error) return (0, _refractory.badRequest)(res, errors, 400);
  const addFlag = {
    id: _Flags.default.length + 1,
    status: 'active',
    ...body,
    created_on: (0, _date.default)()
  };

  _Flags.default.push(addFlag);

  (0, _refractory.okResponse)(res, addFlag);
};
/*
@@ Route          /api/v1/flag
@@ Method         GET
@@ Description    Get all flaged property.
*/


exports.flagAdd = flagAdd;

const getAllFlags = ({
  query
}, res) => {
  const {
    search
  } = query;

  let allFlags = _Flags.default.filter(f => f.status === 'active');

  allFlags = filterByQuery(allFlags, search);
  if (!allFlags.length) return (0, _refractory.badRequest)(res, 'No flags');
  allFlags = allFlags.map(flag => {
    return getFlagedUserProperty(flag);
  });
  return (0, _refractory.okResponse)(res, allFlags);
};
/*
@@ Route          /api/v1/flag/:flagId
@@ Method         GET
@@ Description    Get a flaged property details.
*/


exports.getAllFlags = getAllFlags;

const getFlagById = ({
  params
}, res) => {
  const flag = findFlag(_Flags.default, params);
  if (!flag) return (0, _refractory.badRequest)(res, noFlag);
  const flagedUserProperty = getFlagedUserProperty(flag);
  (0, _refractory.okResponse)(res, flagedUserProperty);
};
/*
@@ Route          /api/v1/flag/:flagId
@@ Method         DELETE
@@ Description    Remove a flag report
*/


exports.getFlagById = getFlagById;

const deleteFlag = ({
  params
}, res) => {
  const flag = findFlag(_Flags.default, params);
  if (!flag) return (0, _refractory.badRequest)(res, noFlag);

  const index = _Flags.default.indexOf(flag);

  _Flags.default.splice(index, 1);

  (0, _refractory.okResponse)(res, {
    message: 'The flag has been removed'
  });
};

exports.deleteFlag = deleteFlag;