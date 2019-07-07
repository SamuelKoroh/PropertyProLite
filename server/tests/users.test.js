import { expect } from 'chai';
import request from 'supertest';
import app from '../app';
import { validUser } from '../testdata/auth';
import { validProperty } from '../testdata/property';

describe('/api/v1/user', () => {
  let admin;
  let testUser1;
  before(async () => {
    admin = await request(app)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/json')
      .send({ email: 'admin@gmail.com', password: 'admin' });

    testUser1 = await request(app)
      .post('/api/v1/auth/signup')
      .set('content-type', 'application/json')
      .send({
        ...validUser,
        email: 'testuser1@test.com',
        first_name: 'testuser1',
        last_name: 'unittest'
      });

    await request(app)
      .post('/api/v1/property')
      .set('x-auth-token', testUser1.body.data.token)
      .send({ ...validProperty, title: '1 bedroom flat' });

    await request(app)
      .post('/api/v1/property')
      .set('x-auth-token', testUser1.body.data.token)
      .send(validProperty);
  });
  describe('GET /', () => {
    it('should return 200 if there are records', async () => {
      const result = await request(app)
        .get('/api/v1/users')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('should return 200 if there are records when filtered with user_type', async () => {
      const result = await request(app)
        .get('/api/v1/users?search=admin')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('should return 200 if there are records when filtered with first_name', async () => {
      const result = await request(app)
        .get(`/api/v1/users?search=${testUser1.body.data.first_name}`)
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('should return 404 if there are no records return when performing filtering', async () => {
      const result = await request(app)
        .get('/api/v1/users?search=11111111111111111111111111111111111111111')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
  });
  describe('GET /me', () => {
    it('should return 200 if the current user profile is load', async () => {
      const result = await request(app)
        .get('/api/v1/users/me')
        .set('x-auth-token', testUser1.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('GET  /:userId', () => {
    it('should return 404 if the user is not found', async () => {
      const result = await request(app)
        .get('/api/v1/users/1000000000')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if the user and he/her properties upload was retrieved', async () => {
      const result = await request(app)
        .get(`/api/v1/users/${testUser1.body.data.id}`)
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('PATCH  /', () => {
    it('should return 200 if the user profile was updated', async () => {
      const result = await request(app)
        .patch('/api/v1/users')
        .set('x-auth-token', testUser1.body.data.token)
        .send({ address: 'new address' });
      expect(result.status).to.equal(200);
    });
    it('should return 200 if the user image was updated', async () => {
      const filePath = `${__dirname}/user.png`;
      const result = await request(app)
        .patch('/api/v1/users')
        .set('x-auth-token', testUser1.body.data.token)
        .attach('image', filePath);
      expect(result.status).to.equal(200);
    });
    it('should return 200 if the user image is not valid', async () => {
      const filePath = `${__dirname}/badimage.txt`;
      const result = await request(app)
        .patch('/api/v1/users')
        .set('x-auth-token', testUser1.body.data.token)
        .attach('image', filePath);
      expect(result.status).to.equal(500);
    });
  });
  describe('PATCH  /:userId/activate', () => {
    it('should return 404 if the user is not found', async () => {
      const result = await request(app)
        .patch('/api/v1/users/1000000/activate')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if the user is_active field is set to true', async () => {
      const result = await request(app)
        .patch(`/api/v1/users/${testUser1.body.data.id}/activate`)
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('PATCH  /:userId/set-admin', () => {
    it('should return 404 if the user is not found', async () => {
      const result = await request(app)
        .patch('/api/v1/users/1000000/set-admin')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if the user is_admin field is set to true', async () => {
      const result = await request(app)
        .patch(`/api/v1/users/${testUser1.body.data.id}/set-admin`)
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('DELETE  /:userId', () => {
    it('should return 404 if the user is not found', async () => {
      const result = await request(app)
        .delete('/api/v1/users/100000')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if the user is_active field is set to false', async () => {
      const result = await request(app)
        .delete(`/api/v1/users/${testUser1.body.data.id}`)
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
});
