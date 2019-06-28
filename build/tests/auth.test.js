"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _chai = require("chai");

var _app = _interopRequireDefault(require("../app"));

var _auth = require("../testdata/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let user = '';
let newUser;
describe('/api/v1/auth', () => {
  before(async () => {
    user = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signup').send(_auth.validUser);
    newUser = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signup').send({ ..._auth.validUser,
      email: 'godwin4koroh@gmail.com',
      password: 'admin'
    });
  });
  describe('POST /signup', () => {
    it('should return 201 if provide with valid data', async () => {
      (0, _chai.expect)(user.status).to.equal(201);
    });
    it('should return 201 if provide with valid data and image', async () => {
      const filePath = `${__dirname}/user.png`;
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signup').field('email', 'imagetest@test.com').field('password', 'secret').field('first_name', 'Ibadan').field('last_name', 'Ojoo').field('phone_number', '20 agodi oojoo').field('address', '45 rooms in a duples').field('user_type', 'per year').attach('image', filePath);
      (0, _chai.expect)(result.status).to.equal(201);
    });
    it('should return 500 if image is not valid', async () => {
      const filePath = `${__dirname}/badimage.txt`;
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signup').field('email', 'imagetest@test.com').field('password', 'secret').field('first_name', 'Ibadan').field('last_name', 'Ojoo').field('phone_number', '20 agodi oojoo').field('address', '45 rooms in a duples').field('user_type', 'per year').attach('image', filePath);
      (0, _chai.expect)(result.status).to.equal(500);
    });
    it('should return 400 if provide with invalid data', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signup').send({
        email: 'john',
        password: 'password'
      });
      (0, _chai.expect)(result.status).to.equal(400);
    });
    it('should return 400 if provided with already existing email', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signup').send(_auth.validUser);
      (0, _chai.expect)(result.status).to.equal(400);
    });
  });
  describe('POST /signin', () => {
    it('should return 200 if successful login', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signin').set('Content-Type', 'application/json').send(_auth.validLogin);
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 400 if provided with no values', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signin').set('Content-Type', 'application/json').send({});
      (0, _chai.expect)(result.status).to.equal(400);
    });
    it('should return 400 if provided with invalid credential', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signin').set('Content-Type', 'application/json').send({
        email: 'demo@demo.com',
        password: 'demopassword'
      });
      (0, _chai.expect)(result.status).to.equal(400);
    });
    it('should return 400 if provided with valid email but wrong password', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signin').set('Content-Type', 'application/json').send({ ..._auth.validLogin,
        password: 'secret45'
      });
      (0, _chai.expect)(result.status).to.equal(400);
    });
  });
  describe('POST /reset-password', () => {
    it('should return 400 if the recovery email is not valid', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/auth/reset-password').set('content-type', 'application/json').send({});
      (0, _chai.expect)(result.status).to.equal(400);
    });
    it('should return 404 if the recovery email is not attached to an account', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/auth/reset-password').set('content-type', 'application/json').send({
        email: 'nomatch@gmail.com'
      });
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if recovery email is valid and mail was sent', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/auth/reset-password').set('content-type', 'application/json').send({
        email: newUser.body.data.email
      });
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('GET /:token', () => {
    let newUserLogin;
    before(async () => {
      newUserLogin = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signin').set('Content-Type', 'application/json').send({
        email: newUser.body.data.email,
        password: 'admin'
      });
    });
    it('should return 404 if the reset password token has expired or not valid', async () => {
      const result = await (0, _supertest.default)(_app.default).get(`/api/v1/auth/reset-password/${newUserLogin.body.data.resetPasswordToken}dd`).set('content-type', 'application/json');
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if the reset password token is valid', async () => {
      const result = await (0, _supertest.default)(_app.default).get(`/api/v1/auth/reset-password/${newUserLogin.body.data.resetPasswordToken}`).set('content-type', 'application/json');
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('PATCH /reset-password', () => {
    let newUserLogin;
    before(async () => {
      newUserLogin = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signin').set('Content-Type', 'application/json').send({
        email: newUser.body.data.email,
        password: 'admin'
      });
    });
    it('should return 400 if it does not contain email and password', async () => {
      const result = await (0, _supertest.default)(_app.default).patch(`/api/v1/auth/reset-password/${newUserLogin.body.data.resetPasswordToken}`).set('content-type', 'application/json').send({});
      (0, _chai.expect)(result.status).to.equal(400);
    });
    it('should return 404 if the email is not attached to an account', async () => {
      const result = await (0, _supertest.default)(_app.default).patch(`/api/v1/auth/reset-password/${newUserLogin.body.data.resetPasswordToken}`).set('content-type', 'application/json').send({
        email: 'nomatch@gmail.com',
        password: 'admin'
      });
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if  email and password is valid ', async () => {
      const result = await (0, _supertest.default)(_app.default).patch(`/api/v1/auth/reset-password/${newUserLogin.body.data.resetPasswordToken}`).set('content-type', 'application/json').send({
        email: newUser.body.data.email,
        password: 'admin'
      });
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
});
//# sourceMappingURL=auth.test.js.map