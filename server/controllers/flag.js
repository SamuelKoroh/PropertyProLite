import Joi from 'joi';
import Flags from '../models/Flags';
import { flagAddSchema } from '../middleware/modelValidation';
import Properties from '../models/Properties';
import Users from '../models/Users';
import { okResponse, badRequest } from '../utils/refractory';
import curDate from '../utils/date';

// ///////////////////////////////////////////////////////////////////
/* This region is for code refractory
@@ Description    function to retrieve flags property and owner detail
*/
const noFlag = { status: 'error', error: 'No flag' };

// Fuction for finding return a single flag
const findFlag = (flags, params) => {
  return flags.find(
    f => f.status === 'active' && parseInt(f.id, 10) === parseInt(params.flagId, 10)
  );
};

// Description    function to retrieve flags property and owner detail
const getFlagedUserProperty = (flag) => {
  const property = Properties.find(p => parseInt(p.id, 10) === parseInt(flag.property_id, 10));
  const { first_name: fName, last_name: lName, id: agentId } = Users.find(
    u => parseInt(u.id, 10) === parseInt(property.owner, 10)
  );
  return {
    ...flag,
    property: property.title,
    agent_id: agentId,
    agent_name: fName.concat(' ', lName)
  };
};

// Description    function to filtered the list of flags
const filterByQuery = (allFlags, search) => {
  let result = allFlags;
  if (search)
    result = result.filter(
      f =>
        f.name.toLocaleLowerCase().startsWith(search.toLocaleLowerCase())
        || f.reason.toLocaleLowerCase().startsWith(search.toLocaleLowerCase())
        || f.email.toLocaleLowerCase().startsWith(search.toLocaleLowerCase())
    );
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
export const flagAdd = ({ body }, res) => {
  const errors = Joi.validate(body, flagAddSchema);
  if (errors.error) return badRequest(res, errors, 400);

  const addFlag = { id: Flags.length + 1, status: 'active', ...body, created_on: curDate() };
  Flags.push(addFlag);
  okResponse(res, addFlag);
};

/*
@@ Route          /api/v1/flag
@@ Method         GET
@@ Description    Get all flaged property.
*/
export const getAllFlags = ({ query }, res) => {
  const { search } = query;
  let allFlags = Flags.filter(f => f.status === 'active');

  allFlags = filterByQuery(allFlags, search);
  if (!allFlags.length) return badRequest(res, 'No flags');

  allFlags = allFlags.map((flag) => {
    return getFlagedUserProperty(flag);
  });
  return okResponse(res, allFlags);
};

/*
@@ Route          /api/v1/flag/:flagId
@@ Method         GET
@@ Description    Get a flaged property details.
*/
export const getFlagById = ({ params }, res) => {
  const flag = findFlag(Flags, params);
  if (!flag) return badRequest(res, noFlag);
  const flagedUserProperty = getFlagedUserProperty(flag);
  okResponse(res, flagedUserProperty);
};

/*
@@ Route          /api/v1/flag/:flagId
@@ Method         DELETE
@@ Description    Remove a flag report
*/
export const deleteFlag = ({ params }, res) => {
  const flag = findFlag(Flags, params);
  if (!flag) return badRequest(res, noFlag);
  const index = Flags.indexOf(flag);
  Flags.splice(index, 1);
  okResponse(res, { message: 'The flag has been removed' });
};
