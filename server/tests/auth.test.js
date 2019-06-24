import request from 'supertest';
import { expect } from 'chai';
import app from '../app';
import { validUser, validLogin } from '../testdata/auth';

let user = '';
describe('/api/v1/auth', () => {
  before(async () => {
    user = await request(app)
      .post('/api/v1/auth/signup')
      .send(validUser);
  });

  describe('POST /signup', () => {
    it('should return 201 if provide with valid data', async () => {
      expect(user.status).to.equal(201);
    });
    it('should return 201 if provide with valid data and image', async () => {
      const filePath = `${__dirname}/stupid.jpg`;
      const result = await request(app)
        .post('/api/v1/auth/signup')
        .field('email', 'imagetest@test.com')
        .field('password', 'secret')
        .field('first_name', 'Ibadan')
        .field('last_name', 'Ojoo')
        .field('phone_number', '20 agodi oojoo')
        .field('address', '45 rooms in a duples')
        .field('user_type', 'per year')
        .attach('image', filePath);
      expect(result.status).to.equal(201);
    });
    it('should return 500 if image is not valid', async () => {
      const filePath = `${__dirname}/badimage.txt`;
      const result = await request(app)
        .post('/api/v1/auth/signup')
        .field('email', 'imagetest@test.com')
        .field('password', 'secret')
        .field('first_name', 'Ibadan')
        .field('last_name', 'Ojoo')
        .field('phone_number', '20 agodi oojoo')
        .field('address', '45 rooms in a duples')
        .field('user_type', 'per year')
        .attach('image', filePath);
      expect(result.status).to.equal(500);
    });
    it('should return 400 if provide with invalid data', async () => {
      const result = await request(app)
        .post('/api/v1/auth/signup')
        .send({ email: 'john', password: 'password' });
      expect(result.status).to.equal(400);
    });
    it('should return 400 if provided with already existing email', async () => {
      const result = await request(app)
        .post('/api/v1/auth/signup')
        .send(validUser);
      expect(result.status).to.equal(400);
    });
  });

  describe('POST /signin', () => {
    it('should return 200 if successful login', async () => {
      const result = await request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send(validLogin);
      expect(result.status).to.equal(200);
    });
    it('should return 400 if provided with no values', async () => {
      const result = await request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send({});
      expect(result.status).to.equal(400);
    });
    it('should return 400 if provided with invalid credential', async () => {
      const result = await request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send({ email: 'demo@demo.com', password: 'demopassword' });
      expect(result.status).to.equal(400);
    });
    it('should return 400 if provided with valid email but wrong password', async () => {
      const result = await request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send({ ...validLogin, password: 'secret45' });
      expect(result.status).to.equal(400);
    });
  });
});
