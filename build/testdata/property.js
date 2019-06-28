"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidToken = exports.inValidProperty = exports.validProperty = void 0;
const validProperty = {
  title: '2 bedroom bungalow',
  price: 200000,
  state: 'Delta',
  city: 'Warri',
  address: '20 5 igbudu',
  type: '2 bedroom',
  billing_type: 'per year',
  description: 'This room is nice',
  deal_type: 'for rent'
};
exports.validProperty = validProperty;
const inValidProperty = {
  title: '2 bedroom bungalow',
  price: '200000',
  state: 'Delta',
  city: 'Warri',
  address: '20 5 igbudu',
  type: '2 bedroom',
  billing_type: 'per year',
  description: 'This room is nices',
  deal_type: 'for rent'
};
exports.inValidProperty = inValidProperty;
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaXNfYWRtaW4iOmZhbHNlLCJ1c2VyX3R5cGUiOiJhZ2VudCIsImlhdCI6MTU2MTIyMTcyMywiZXhwIjoxNTYxMjI1MzIzfQ.veC2W4vpble0ZHovMTYIHq7lnMnUtDVDsleYqw10ADQ';
exports.invalidToken = invalidToken;
//# sourceMappingURL=property.js.map