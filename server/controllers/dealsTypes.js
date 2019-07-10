import {
  addDealType,
  updateDealType,
  getAllRecord,
  deleteRow,
  getRecord
} from '../utils/refractory';
/*
@@ Route          /api/v1/deals-types/deals
@@ Method         POST
@@ Description    Add new deal
*/
export const addPropertyDeal = async (req, res) => {
  addDealType(req, res, 'deals');
};

/*
@@ Route          /api/v1/deals-types/deals
@@ Method         Get
@@ Description    Get all deals
*/
export const getAllPropertyDeals = async (req, res) => {
  getAllRecord(res, 'deals');
};

/*
@@ Route          /api/v1/deals-types/deals/:id
@@ Method         Get
@@ Description    Get a deal
*/
export const getPropertyDeal = async (req, res) => {
  getRecord(req, res, 'deals');
};
/*
@@ Route          /api/v1/deals-types/deals/:id
@@ Method         PATCH
@@ Description    Update a deal
*/
export const updatePropertyDeal = async (req, res) => {
  updateDealType(req, res, 'deals');
};
/*
@@ Route          /api/v1/deals-types/deals/:id
@@ Method         DELETE
@@ Description    Delete a deal
*/
export const deletePropertyDeal = async ({ params: { id } }, res) => {
  deleteRow(res, 'deals', id);
};

/*
@@ Route          /api/v1/deals-types/types
@@ Method         POST
@@ Description    Add new type
*/
export const addPropertyTypes = async (req, res) => {
  addDealType(req, res, 'types');
};
/*
@@ Route          /api/v1/deals-types/types
@@ Method         Get
@@ Description    Get all types
*/
export const getAllPropertyTypes = async (req, res) => {
  getAllRecord(res, 'types');
};
/*
@@ Route          /api/v1/deals-types/types/:id
@@ Method         GET
@@ Description    Get  type
*/
export const getPropertyType = async (req, res) => {
  getRecord(req, res, 'types');
};
/*
@@ Route          /api/v1/deals-types/types/:id
@@ Method         UPDATE
@@ Description    Update type
*/
export const updatePropertyType = async (req, res) => {
  updateDealType(req, res, 'types');
};
/*
@@ Route          /api/v1/deals-types/types/:id
@@ Method         DELETE
@@ Description    Delete  type
*/
export const deletePropertyType = async ({ params: { id } }, res) => {
  deleteRow(res, 'types', id);
};
