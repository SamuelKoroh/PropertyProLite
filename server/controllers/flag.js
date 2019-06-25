import Joi from 'joi';
import Flags from '../models/Flags';
import { flagAddSchema } from '../middleware/modelValidation';
import Properties from '../models/Properties';
import Users from '../models/Users';
import { okResponse, badRequest } from '../utils/refractory';

// ///////////////////////////////////////////////////////////////////
/* This region is for code refractory
@@ Description    function to retrieve flags property and owner detail
*/
const noFlag = { status: 'error', error: 'No flag' };

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
const filterByQuery = (allFlags, name, email, reason) => {
  let result = allFlags;
  if (name)
    result = result.filter(f => f.name.toLocaleLowerCase().startsWith(name.toLocaleLowerCase()));
  if (reason)
    result = result.filter(f =>
      f.reason.toLocaleLowerCase().startsWith(reason.toLocaleLowerCase()));
  if (email)
    result = result.filter(f => f.email.toLocaleLowerCase().startsWith(email.toLocaleLowerCase()));
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

  const addFlag = { id: Flags.length + 1, status: 'active', ...body, created_on: Date.now };
  Flags.push(addFlag);

  okResponse(res, addFlag);
};

/*
@@ Route          /api/v1/flag
@@ Method         GET
@@ Description    Get all flaged property.
*/
export const getAllFlags = ({ query }, res) => {
  const { name, reason, email } = query;
  let allFlags = Flags.filter(f => f.status === 'active');

  allFlags = filterByQuery(allFlags, name, email, reason);
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
  const flag = Flags.find(
    f => f.status === 'active' && parseInt(f.id, 10) === parseInt(params.flagId, 10)
  );

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
  const flag = Flags.find(
    f => f.status === 'active' && parseInt(f.id, 10) === parseInt(params.flagId, 10)
  );
  if (!flag) return badRequest(res, noFlag);

  const index = Flags.indexOf(flag);
  Flags.splice(index, 1);

  okResponse(res, { message: 'The flag has been removed' });
};
