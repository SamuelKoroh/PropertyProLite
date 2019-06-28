"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validLogin = exports.validUser = void 0;
const validUser = {
  email: 'steve@gmail.com',
  password: 'secret',
  first_name: 'Steve',
  last_name: 'Okoro',
  phone_number: '08037545637',
  address: '24 Oboro park PH',
  user_type: 'regular'
}; // export const validAgent = {
//   email: 'agent@gmail.com',
//   password: 'agent',
//   first_name: 'Steve',
//   last_name: 'Okoro',
//   phone_number: '08037545637',
//   address: '24 Oboro park PH',
//   user_type: 'agent'
// };

exports.validUser = validUser;
const validLogin = {
  email: 'steve@gmail.com',
  password: 'secret'
};
exports.validLogin = validLogin;