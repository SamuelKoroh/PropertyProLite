"use strict";

var _chai = require("chai");

var _supertest = _interopRequireDefault(require("supertest"));

var _app = _interopRequireDefault(require("../app"));

var _auth = require("../testdata/auth");

var _property = require("../testdata/property");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('/api/v1/user', () => {
  let admin;
  let testUser1;
  before(async () => {
    admin = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signin').set('content-type', 'application/json').send({
      email: 'admin@gmail.com',
      password: 'admin'
    });
    testUser1 = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signup').set('content-type', 'application/json').send({ ..._auth.validUser,
      email: 'testuser1@test.com',
      first_name: 'testuser1',
      last_name: 'unittest'
    });
    await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', testUser1.body.data.token).send({ ..._property.validProperty,
      title: '1 bedroom flat'
    });
    await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', testUser1.body.data.token).send(_property.validProperty);
  });
  describe('GET /', () => {
    it('should return 200 if there are records', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/users').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 200 if there are records when filtered with user_type', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/users?search=admin').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 200 if there are records when filtered with first_name', async () => {
      const result = await (0, _supertest.default)(_app.default).get(`/api/v1/users?search=${testUser1.body.data.first_name}`).set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 404 if there are no records return when performing filtering', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/users?search=11111111111111111111111111111111111111111').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
  });
  describe('GET /me', () => {
    it('should return 200 if the current user profile is load', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/users/me').set('x-auth-token', testUser1.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('GET  /:userId', () => {
    it('should return 404 if the user is not found', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/users/1000000000').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if the user and he/her properties upload was retrieved', async () => {
      const result = await (0, _supertest.default)(_app.default).get(`/api/v1/users/${testUser1.body.data.id}`).set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('PATCH  /:userId', () => {
    it('should return 404 if the user is not found', async () => {
      const result = await (0, _supertest.default)(_app.default).patch('/api/v1/users/10000').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if the user profile was updated', async () => {
      const result = await (0, _supertest.default)(_app.default).patch(`/api/v1/users/${testUser1.body.data.id}`).set('x-auth-token', testUser1.body.data.token).send({
        address: 'new address'
      });
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 200 if the user image was updated', async () => {
      const filePath = `${__dirname}/user.png`;
      const result = await (0, _supertest.default)(_app.default).patch(`/api/v1/users/${testUser1.body.data.id}`).set('x-auth-token', testUser1.body.data.token).attach('image', filePath);
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 200 if the user image is not valid', async () => {
      const filePath = `${__dirname}/badimage.txt`;
      const result = await (0, _supertest.default)(_app.default).patch(`/api/v1/users/${testUser1.body.data.id}`).set('x-auth-token', testUser1.body.data.token).attach('image', filePath);
      (0, _chai.expect)(result.status).to.equal(500);
    });
  });
  describe('PATCH  /:userId/activate', () => {
    it('should return 404 if the user is not found', async () => {
      const result = await (0, _supertest.default)(_app.default).patch('/api/v1/users/1000000/activate').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if the user is_active field is set to true', async () => {
      const result = await (0, _supertest.default)(_app.default).patch(`/api/v1/users/${testUser1.body.data.id}/activate`).set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('DELETE  /:userId', () => {
    it('should return 404 if the user is not found', async () => {
      const result = await (0, _supertest.default)(_app.default).delete('/api/v1/users/100000').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if the user is_active field is set to false', async () => {
      const result = await (0, _supertest.default)(_app.default).delete(`/api/v1/users/${testUser1.body.data.id}`).set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
});
//# sourceMappingURL=users.test.js.map