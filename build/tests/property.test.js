"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _chai = require("chai");

var _app = _interopRequireDefault(require("../app"));

var _auth = require("../testdata/auth");

var _property = require("../testdata/property");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('/api/v1/property', () => {
  const filePath = `${__dirname}/house.png`;
  let user = '';
  let agent = '';
  let agent2 = '';
  before(async () => {
    user = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signup').send({ ..._auth.validUser,
      email: 'test@gmail.com'
    });
    agent = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signup').send({ ..._auth.validUser,
      email: 'agent@gmail.com',
      user_type: 'agent'
    });
    agent2 = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signup').send({ ..._auth.validUser,
      email: 'agent2@gmail.com',
      user_type: 'agent'
    });
  });
  describe('POST /', async () => {
    it('should return 201 if the property details is valid without images', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', agent.body.data.token).send(_property.validProperty);
      (0, _chai.expect)(result.status).to.equal(201);
    });
    it('should return 201 if the property details is valid and has one or more image', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', agent.body.data.token).field('title', '45 rooms duplex in agodi').field('price', 400000).field('state', 'Ibadan').field('city', 'Ojoo').field('address', '20 agodi oojoo').field('type', '45 rooms in a duples').field('billing_type', 'per year').field('description', 'Nice one').field('deal_type', 'for sale').attach('images', filePath);
      (0, _chai.expect)(result.status).to.equal(201);
    });
    it('should return 401 if user has no token', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/property').send(_property.validProperty);
      (0, _chai.expect)(result.status).to.equal(401);
    });
    it('should return 400 if user has provide invalid token', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', 'invalidToken').send(_property.validProperty);
      (0, _chai.expect)(result.status).to.equal(400);
    });
    it('should return 403 if user is not an agent or admin', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', user.body.data.token).send(_property.validProperty);
      (0, _chai.expect)(result.status).to.equal(403);
    });
    it('should return 400 if the property details is not valid', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', agent.body.data.token).send({ ..._property.validProperty,
        title: ''
      });
      (0, _chai.expect)(result.status).to.equal(400);
    });
    it('should return 400 if the property already exist', async () => {
      const result = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', agent.body.data.token).send(_property.validProperty);
      (0, _chai.expect)(result.status).to.equal(400);
    });
  });
  describe('GET /', () => {
    it('should return 200 if there is property but no query string provide', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/property');
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 200 if passed price query string', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/property?price=500000');
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 200 if passed location query string', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/property?location=Warri');
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 200 if passed deal query string', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/property?deal=for rent');
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 200 if passed type query string', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/property?type=2 bedroom');
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 404 if no property is found', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/property?location=2 bedroom');
      (0, _chai.expect)(result.status).to.equal(404);
    });
  });
  describe('GET /:propertyId', () => {
    it('it should return 404 if property is not found', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/property/50000');
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('it should return 200 if property is  found', async () => {
      const result = await (0, _supertest.default)(_app.default).get('/api/v1/property/1');
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('PATCH /:propertyId/sold', () => {
    let property;
    before(async () => {
      property = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', agent.body.data.token).send({ ..._property.validProperty,
        title: 'duplex in abuja'
      });
    });
    it('should return 404 if the property does not exist', async () => {
      const result = await (0, _supertest.default)(_app.default).patch('/api/v1/property/100').set('x-auth-token', agent.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 403 if the property does not belong to the user', async () => {
      const result = await (0, _supertest.default)(_app.default).patch(`/api/v1/property/${property.body.data.id}/sold`).set('x-auth-token', agent2.body.data.token);
      (0, _chai.expect)(result.status).to.equal(403);
    });
    it('should return 200 if the property does exist and belong to the user and was marked as sold', async () => {
      const result = await (0, _supertest.default)(_app.default).patch(`/api/v1/property/${property.body.data.id}/sold`).set('x-auth-token', agent.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('PATCH /:propertyId', () => {
    let property;
    before(async () => {
      property = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', agent.body.data.token).send({ ..._property.validProperty,
        title: '5 room duplex in abuja'
      });
    });
    it('should return 404 if the property does not exist', async () => {
      const result = await (0, _supertest.default)(_app.default).patch('/api/v1/property/100').set('x-auth-token', agent.body.data.token).send({
        price: 200
      });
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 403 if the property does not belong to the user', async () => {
      const result = await (0, _supertest.default)(_app.default).patch('/api/v1/property/1').set('x-auth-token', agent2.body.data.token).send({
        price: 200
      });
      (0, _chai.expect)(result.status).to.equal(403);
    });
    it('should return 200 if the property does exist and belong to the user and was updated', async () => {
      const result = await (0, _supertest.default)(_app.default).patch(`/api/v1/property/${property.body.data.id}`).set('x-auth-token', agent.body.data.token).send({
        price: 200
      });
      (0, _chai.expect)(result.status).to.equal(200);
    });
    it('should return 200 if the property does exist and belong to the user and its image was updated', async () => {
      const res = await (0, _supertest.default)(_app.default).patch(`/api/v1/property/${property.body.data.id}`).set('x-auth-token', agent.body.data.token).attach('images', filePath);
      (0, _chai.expect)(res.status).to.equal(200);
    });
  });
  describe('PATCH /:propertyId/activate', () => {
    let property;
    let admin;
    before(async () => {
      property = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', agent.body.data.token).send({ ..._property.validProperty,
        title: '54 room duplex in abuja'
      });
      admin = await (0, _supertest.default)(_app.default).post('/api/v1/auth/signin').set('Content-Type', 'application/json').send({
        email: 'admin@gmail.com',
        password: 'admin'
      });
    });
    it('should return 403 if the user is not an admin', async () => {
      const result = await (0, _supertest.default)(_app.default).patch(`/api/v1/property/${property.body.data.id}/activate`).set('x-auth-token', agent2.body.data.token);
      (0, _chai.expect)(result.status).to.equal(403);
    });
    it('should return 404 if the property does not exist', async () => {
      const result = await (0, _supertest.default)(_app.default).patch('/api/v1/property/100/activate').set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 200 if the property does exist and the operation was successful', async () => {
      const result = await (0, _supertest.default)(_app.default).patch(`/api/v1/property/${property.body.data.id}/activate`).set('x-auth-token', admin.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
  describe('DELETE /:propertyId', () => {
    let property;
    before(async () => {
      property = await (0, _supertest.default)(_app.default).post('/api/v1/property').set('x-auth-token', agent.body.data.token).send({ ..._property.validProperty,
        title: '12 room duplex in abuja'
      });
    });
    it('should return 404 if the property does not exist', async () => {
      const result = await (0, _supertest.default)(_app.default).delete('/api/v1/property/100').set('x-auth-token', agent.body.data.token);
      (0, _chai.expect)(result.status).to.equal(404);
    });
    it('should return 403 if the property does not belong to the user', async () => {
      const result = await (0, _supertest.default)(_app.default).delete(`/api/v1/property/${property.body.data.id}`).set('x-auth-token', agent2.body.data.token);
      (0, _chai.expect)(result.status).to.equal(403);
    });
    it('should return 200 if the property to be delete does exist and belong to the user', async () => {
      const result = await (0, _supertest.default)(_app.default).delete(`/api/v1/property/${property.body.data.id}`).set('x-auth-token', agent.body.data.token);
      (0, _chai.expect)(result.status).to.equal(200);
    });
  });
});
//# sourceMappingURL=property.test.js.map