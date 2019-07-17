import request from 'supertest';
import { expect } from 'chai';
import app from '../server/app';
import { validProperty } from './testdata/property';

describe('/api/v1/flag', () => {
  let admin = '';
  let flager = '';
  let report;
  before(async () => {
    admin = await request(app)
      .post('/api/v1/auth/signin')
      .set('Content-Type', 'application/json')
      .send({ email: 'admin@gmail.com', password: 'admin' });

    flager = await request(app)
      .post('/api/v1/auth/signup')
      .field('email', 'agent@agent.com')
      .field('password', 'agent')
      .field('first_name', 'Ibadan')
      .field('last_name', 'Ojoo')
      .field('phone_number', '20 agodi oojoo')
      .field('address', '45 rooms in a duples');

    await request(app)
      .post('/api/v1/property')
      .set('token', flager.body.data.token)
      .send({ ...validProperty, title: 'flaged property 1' });

    await request(app)
      .post('/api/v1/property')
      .set('token', flager.body.data.token)
      .send({ ...validProperty, title: 'flaged property 2' });
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
      report = await request(app)
        .post('/api/v1/flag')
        .set('Content-Type', 'application/json')
        .send({
          email: 'reporter1@gmail.com',
          name: 'sarah',
          reason: 'wierd demand',
          description: 'wierd demand from agent',
          property_id: 2
        });
      expect(report.status).to.equal(200);
    });
  });
  describe('GET /', () => {
    it('it should return 403 if the user acces is forbidden', async () => {
      const result = await request(app)
        .get('/api/v1/flag')
        .set('token', flager.body.data.token);
      expect(result.status).to.equal(403);
    });
    it('it should return 404 if there are no record returned by using query parameter', async () => {
      const result = await request(app)
        .get('/api/v1/flag?search=hhhhhhhhhhhhhhhhhh')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('it should return 200 if there are one or more records by using name query string', async () => {
      const result = await request(app)
        .get('/api/v1/flag?search=sarah')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('it should return 200 if there are one or more records by using reason query string', async () => {
      const result = await request(app)
        .get('/api/v1/flag?search=wierd')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('it should return 200 if there are one or more records by using email query string', async () => {
      const result = await request(app)
        .get('/api/v1/flag?search=reporter')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('it should return 200 if there are one or more records', async () => {
      const result = await request(app)
        .get('/api/v1/flag')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('GET /:flag_id', () => {
    it('it should return 404 if there is no matching record', async () => {
      const result = await request(app)
        .get('/api/v1/flag/10000')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('it should return 200 if there is matching record', async () => {
      const result = await request(app)
        .get(`/api/v1/flag/${report.body.data.id}`)
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('DELETE /:flag_id', () => {
    it('it should return 404 if there is no matching record', async () => {
      const result = await request(app)
        .delete('/api/v1/flag/10000')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });

    it('should return 200 successfully remove the flag', async () => {
      const result = await request(app)
        .delete('/api/v1/flag/1')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
});
