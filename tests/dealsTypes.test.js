import request from 'supertest';
import { expect } from 'chai';
import app from '../server/app';

describe('/api/v1/deals-types', () => {
  let admin = '';
  let propertyDeal;
  let propertyType;
  before(async () => {
    admin = await request(app)
      .post('/api/v1/auth/signin')
      .set('Content-Type', 'application/json')
      .send({ email: 'admin@gmail.com', password: 'admin' });

    propertyDeal = await request(app)
      .post('/api/v1/deals-types/deals')
      .set('Content-Type', 'application/json')
      .set('token', admin.body.data.token)
      .send({ name: 'for lease', description: 'for leasing properties' });

    propertyType = await request(app)
      .post('/api/v1/deals-types/types')
      .set('token', admin.body.data.token)
      .send({ name: '1 bedroom flat', description: '1 bedroom flat users' });
  });

  describe('POST /deals', () => {
    it('should return 201 if the property deal was saved', async () => {
      expect(propertyDeal.status).to.equal(201);
    });
    it('should return 400 if the property deal already exist', async () => {
      const result = await request(app)
        .post('/api/v1/deals-types/deals')
        .set('token', admin.body.data.token)
        .send({ name: 'for lease', description: 'for leasing properties' });
      expect(result.status).to.equal(400);
    });
  });
  describe('GET /deals', () => {
    it('should return 200 if all property deals are return', async () => {
      const result = await request(app)
        .get('/api/v1/deals-types/deals')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('GET /deals/:id', () => {
    it('should return 404 if no matching record', async () => {
      const result = await request(app)
        .get('/api/v1/deals-types/deals/10000')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if there is a matching record', async () => {
      const result = await request(app)
        .get(`/api/v1/deals-types/deals/${propertyDeal.body.data.id}`)
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('PATCH /deals/:id', () => {
    it('should return 404 if no matching record', async () => {
      const result = await request(app)
        .patch('/api/v1/deals-types/deals/10000')
        .set('token', admin.body.data.token)
        .send({ name: '1 bedroom flat', description: ' Properties for rent' });
      expect(result.status).to.equal(404);
    });
    it('should return 200 if there is a matching record', async () => {
      const result = await request(app)
        .patch(`/api/v1/deals-types/deals/${propertyDeal.body.data.id}`)
        .set('token', admin.body.data.token)
        .send({ name: '1 bedroom flat', description: ' Properties for rent' });
      expect(result.status).to.equal(200);
    });
  });
  describe('DELETE /deals/:id', () => {
    it('should return 404 if no matching record', async () => {
      const result = await request(app)
        .delete('/api/v1/deals-types/deals/10000')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if the record is deleted', async () => {
      const result = await request(app)
        .delete(`/api/v1/deals-types/deals/${propertyDeal.body.data.id}`)
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });

  describe('POST /types', () => {
    it('should return 201 if the property deal was saved', async () => {
      expect(propertyType.status).to.equal(201);
    });
    it('should return 400 if the property type already exist', async () => {
      const result = await request(app)
        .post('/api/v1/deals-types/types')
        .set('token', admin.body.data.token)
        .send({ name: '1 bedroom flat', description: '1 bedroom flat users' });
      expect(result.status).to.equal(400);
    });
  });
  describe('GET /types', () => {
    it('should return 200 if all property types are return', async () => {
      const result = await request(app)
        .get('/api/v1/deals-types/types')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('GET /types/:id', () => {
    it('should return 404 if no matching record', async () => {
      const result = await request(app)
        .get('/api/v1/deals-types/types/10000')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if there is a matching record', async () => {
      const result = await request(app)
        .get(`/api/v1/deals-types/types/${propertyType.body.data.id}`)
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('PATCH /deals/:id', () => {
    it('should return 404 if no matching record', async () => {
      const result = await request(app)
        .patch('/api/v1/deals-types/types/10000')
        .set('token', admin.body.data.token)
        .send({ description: '3 room floor' });
      expect(result.status).to.equal(404);
    });
    it('should return 200 if there is a matching record', async () => {
      const result = await request(app)
        .patch(`/api/v1/deals-types/types/${propertyType.body.data.id}`)
        .set('token', admin.body.data.token)
        .send({ name: '1 bedroom flat', description: ' nice home' });
      expect(result.status).to.equal(200);
    });
  });
  describe('DELETE /deals/:id', () => {
    it('should return 404 if no matching record', async () => {
      const result = await request(app)
        .delete('/api/v1/deals-types/types/10000')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if the record is deleted', async () => {
      const result = await request(app)
        .delete(`/api/v1/deals-types/types/${propertyType.body.data.id}`)
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
});
