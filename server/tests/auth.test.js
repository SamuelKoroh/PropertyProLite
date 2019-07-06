import request from 'supertest';
import { expect } from 'chai';
import app from '../app';
import { validUser, validLogin } from '../testdata/auth';
import db from '../db/db';

// const db = new Database();

let user = '';
let newUser;
describe('/api/v1/auth', () => {
  before(async () => {
    await db.query('TRUNCATE TABLE users');
    // db.close();

    user = await request(app)
      .post('/api/v1/auth/signup')
      .send(validUser);

    newUser = await request(app)
      .post('/api/v1/auth/signup')
      .send({ ...validUser, email: 'godwin4koroh@gmail.com', password: 'admin' });
  });
  describe('POST /signup', () => {
    it('should return 201 if provide with valid data', async () => {
      expect(user.status).to.equal(201);
    });
    it('should return 201 if provide with valid data and image', async () => {
      const filePath = `${__dirname}/user.png`;
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

  describe('POST /reset-password', () => {
    it('should return 400 if the recovery email is not valid', async () => {
      const result = await request(app)
        .post('/api/v1/auth/reset-password')
        .set('content-type', 'application/json')
        .send({});
      expect(result.status).to.equal(400);
    });
    it('should return 404 if the recovery email is not attached to an account', async () => {
      const result = await request(app)
        .post('/api/v1/auth/reset-password')
        .set('content-type', 'application/json')
        .send({ email: 'nomatch@gmail.com' });
      expect(result.status).to.equal(404);
    });
    it('should return 200 if recovery email is valid and mail was sent', async () => {
      const result = await request(app)
        .post('/api/v1/auth/reset-password')
        .set('content-type', 'application/json')
        .send({ email: newUser.body.data.email });
      expect(result.status).to.equal(200);
    });
  });

  describe('GET /:token', () => {
    let newUserLogin;
    before(async () => {
      newUserLogin = await request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send({ email: newUser.body.data.email, password: 'admin' });
    });
    it('should return 404 if the reset password token has expired or not valid', async () => {
      const result = await request(app)
        .get(`/api/v1/auth/reset-password/${newUserLogin.body.data.reset_password_token}dd`)
        .set('content-type', 'application/json');
      expect(result.status).to.equal(404);
    });
    it('should return 200 if the reset password token is valid', async () => {
      const result = await request(app)
        .get(`/api/v1/auth/reset-password/${newUserLogin.body.data.reset_password_token}`)
        .set('content-type', 'application/json');
      expect(result.status).to.equal(200);
    });
  });

  describe('PATCH /reset-password', () => {
    let newUserLogin;
    before(async () => {
      newUserLogin = await request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send({ email: newUser.body.data.email, password: 'admin' });
    });
    it('should return 400 if it does not contain email and password', async () => {
      const result = await request(app)
        .patch(`/api/v1/auth/reset-password/${newUserLogin.body.data.reset_password_token}`)
        .set('content-type', 'application/json')
        .send({});
      expect(result.status).to.equal(400);
    });
    it('should return 404 if the email is not attached to an account', async () => {
      const result = await request(app)
        .patch(`/api/v1/auth/reset-password/${newUserLogin.body.data.reset_password_token}`)
        .set('content-type', 'application/json')
        .send({ email: 'nomatch@gmail.com', password: 'admin' });
      expect(result.status).to.equal(404);
    });
    it('should return 200 if  email and password is valid ', async () => {
      const result = await request(app)
        .patch(`/api/v1/auth/reset-password/${newUserLogin.body.data.reset_password_token}`)
        .set('content-type', 'application/json')
        .send({ email: newUser.body.data.email, password: 'admin' });
      expect(result.status).to.equal(200);
    });
  });
});
