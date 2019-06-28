"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _chai = require("chai");

var _app = _interopRequireDefault(require("../app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('/api/v1/deals-types', () => {
  let admin = '';
  let propertyDeal;
  let propertyType;
  before(async () => {
    admin = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signin').set('Content-Type', 'application/json').send({
      email: 'admin@gmail.com',
      password: 'admin'
    });
    propertyDeal = await (0, _supertest.default)(_app.default).post('/api/v1/deals-types/deals').set('x-auth-token', admin.body.data.token).send({
      name: 'for lease',
      description: 'for leasing properties'
    });
    propertyType = await (0, _supertest.default)(_app.default).post('/api/v1/deals-types/types').set('x-auth-token', admin.body.data.token).send({
      name: '1 bedroom flat',
      description: '1 bedroom flat users'
    });
  });
  describe('POST /deals', () => {
    it('should return 200 if the property deal was saved', async () => {
      (0, _chai.expect)(propertyDeal.status).to.equal(200);
    });
  });
  describe('GET /deals', () => {
    it('should return 200 if all property deals are return', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/deals-types/deals').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('GET /deals/:id', () => {
    it('should return 404 if no matching record', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/deals-types/deals/10000').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if there is a matching record', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/deals-types/deals/1').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('PATCH /deals/:id', () => {
    it('should return 404 if no matching record', async () => {
      const result = await (0, _supertest.default)(_app.default).patch('/api/v1/deals-types/deals/10000').set('x-auth-token', admin.body.data.token).send({
        description: ' Properties for rent'
      });
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if there is a matching record', async () => {
      const result = await (0, _supertest.default)(_app.default).patch('/api/v1/deals-types/deals/1').set('x-auth-token', admin.body.data.token).send({
        description: ' Properties for rent'
      });
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('DELETE /deals/:id', () => {
    it('should return 404 if no matching record', async () => {
      const result = await (0, _supertest.default)(_app.default).delete('/api/v1/deals-types/deals/10000').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if the record is deleted', async () => {
      const result = await (0, _supertest.default)(_app.default).delete('/api/v1/deals-types/deals/1').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('POST /types', () => {
    it('should return 200 if the property deal was saved', async () => {
      (0, _chai.expect)(propertyType.status).to.equal(200);
    });
  });
  describe('GET /types', () => {
    it('should return 200 if all property types are return', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/deals-types/types').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('GET /types/:id', () => {
    it('should return 404 if no matching record', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/deals-types/types/10000').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if there is a matching record', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/deals-types/types/1').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('PATCH /deals/:id', () => {
    it('should return 404 if no matching record', async () => {
      const result = await (0, _supertest.default)(_app.default).patch('/api/v1/deals-types/types/10000').set('x-auth-token', admin.body.data.token).send({
        description: '3 room floor'
      });
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if there is a matching record', async () => {
      const result = await (0, _supertest.default)(_app.default).patch('/api/v1/deals-types/types/1').set('x-auth-token', admin.body.data.token).send({
        description: ' nice home'
      });
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('DELETE /deals/:id', () => {
    it('should return 404 if no matching record', async () => {
      const result = await (0, _supertest.default)(_app.default).delete('/api/v1/deals-types/types/10000').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if the record is deleted', async () => {
      const result = await (0, _supertest.default)(_app.default).delete('/api/v1/deals-types/types/1').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
});
//# sourceMappingURL=deals-types.test.js.map