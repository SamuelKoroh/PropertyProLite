"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _chai = require("chai");

var _app = _interopRequireDefault(require("../app"));

var _auth = require("../testdata/auth");

var _property = require("../testdata/property");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('/api/v1/favourites', () => {
  let admin;
  let testUser2;
  let property1;
  let property2;
  before(async () => {
    admin = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signin').set('content-type', 'application/json').send({
      email: 'admin@gmail.com',
      password: 'admin'
    });
    testUser2 = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signup').set('content-type', 'application/json').send({ ..._auth.validUser,
      email: 'testuser2@test.com',
      first_name: 'testuser2',
      last_name: 'unittest'
    });
    property1 = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', admin.body.data.token).send({ ..._property.validProperty,
      title: '12 bedroom flat'
    });
  });
  describe('POST /:propertyId', () => {
    it('should return 200 if the property was added to his/her favourite list', async () => {
      const result = await (0, _supertest.default)(_app.default).post(`/api/v1/favourites/${property1.body.data.id}`).set('x-auth-token', testUser2.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 200 if the property was removed from the favourite list', async () => {
      const result = await (0, _supertest.default)(_app.default).post(`/api/v1/favourites/${property1.body.data.id}`).set('x-auth-token', testUser2.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('GET /', () => {
    before(async () => {
      property1 = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', admin.body.data.token).send({ ..._property.validProperty,
        title: '1552 bedroom flat'
      });
      property2 = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', admin.body.data.token).send({ ..._property.validProperty,
        title: '12542 bedroom flat'
      });
      await (0, _supertest.default)(_app.default).post(`/api/v1/favourites/${property1.body.data.id}`).set('x-auth-token', testUser2.body.data.token);
      await (0, _supertest.default)(_app.default).post(`/api/v1/favourites/${property2.body.data.id}`).set('x-auth-token', testUser2.body.data.token);
    });
    it('should return 200 if the user favourite list is loaded successfully', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/favourites').set('x-auth-token', testUser2.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('DELETE /:favouriteId', () => {
    it('should return 404 if the property does not exist in the favourite list', async () => {
      const result = await (0, _supertest.default)(_app.default).delete('/api/v1/favourites/10000000').set('x-auth-token', testUser2.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if the property was removed from the favourite list', async () => {
      const result = await (0, _supertest.default)(_app.default).delete('/api/v1/favourites/1').set('x-auth-token', testUser2.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
});
//# sourceMappingURL=favourites.test.js.map