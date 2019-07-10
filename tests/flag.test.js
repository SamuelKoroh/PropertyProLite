import request from 'supertest';
import { expect } from 'chai';
import app from '../server/app';

describe('/api/v1/flag', () => {
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
});
