import request from 'supertest';
import { expect } from 'chai';
import app from '../app';
// import { validUser } from '../testdata/auth';
// import { validProperty } from '../testdata/property';

describe('/api/v1/flag', () => {
  let admin = '';
  let flaged = '';
  before(async () => {
    admin = await request(app)
      .post('/api/v1/auth/signin')
      .set('Content-Type', 'application/json')
      .send({ email: 'admin@gmail.com', password: 'admin' });

    flaged = await request(app)
      .post('/api/v1/auth/signup')
      .field('email', 'agent@agent.com')
      .field('password', 'agent')
      .field('first_name', 'Ibadan')
      .field('last_name', 'Ojoo')
      .field('phone_number', '20 agodi oojoo')
      .field('address', '45 rooms in a duples')
      .field('user_type', 'per year');
  });
  describe('POST  /', () => {
    it('should return 400 if the request body is not valid', async () => {
      const result = await request(app)
        .post('/api/v1/flag')
        .set('Content-Type', 'application/json')
        .send({ email: 'admin@gmail.com', name: 'admin' });
      expect(result.status).to.equal(400);
    });
    it('should return 200 if the request body is valid', async () => {
      const result = await request(app)
        .post('/api/v1/flag')
        .set('Content-Type', 'application/json')
        .send({
          email: 'reporter1@gmail.com',
          name: 'sarah',
          reason: 'wierd demand',
          description: 'wierd demand from agent',
          property_id: 2
        });
      expect(result.status).to.equal(200);
    });
  });
  describe('GET /', () => {
    it('it should return 403 if the user acces is forbidden', async () => {
      const result = await request(app)
        .get('/api/v1/flag')
        .set('x-auth-token', flaged.body.data.token);
      expect(result.status).to.equal(403);
    });
    it('it should return 404 if there are no record returned by using query parameter', async () => {
      const result = await request(app)
        .get('/api/v1/flag?search=hhhhhhhhhhhhhhhhhh')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('it should return 200 if there are one or more records by using name query string', async () => {
      const result = await request(app)
        .get('/api/v1/flag?search=sarah')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('it should return 200 if there are one or more records by using reason query string', async () => {
      const result = await request(app)
        .get('/api/v1/flag?search=wierd')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('it should return 200 if there are one or more records by using email query string', async () => {
      const result = await request(app)
        .get('/api/v1/flag?search=reporter')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('it should return 200 if there are one or more records', async () => {
      const result = await request(app)
        .get('/api/v1/flag')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });

  describe('GET /:flagId', () => {
    it('it should return 404 if there is no matching record', async () => {
      const result = await request(app)
        .get('/api/v1/flag/10000')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('it should return 200 if there is matching record', async () => {
      const result = await request(app)
        .get('/api/v1/flag/1')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('DELETE /:flagId', () => {
    it('it should return 404 if there is no matching record', async () => {
      const result = await request(app)
        .delete('/api/v1/flag/10000')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });

    it('should return 200 successfully remove the flag', async () => {
      const result = await request(app)
        .delete('/api/v1/flag/1')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
});

// Favourites Test
