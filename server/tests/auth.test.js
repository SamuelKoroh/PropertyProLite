// import request from 'supertest';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { validUser, validLogin } from './../testdata/auth';

chai.use(chaiHttp);

describe('/api/v1/auth', () => {
  let user = '';
  before(async () => {
    user = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(validUser);
  });

  describe('POST /signup', () => {
    it('should return 201 if provide with valid data', async () => {
      expect(user.status).to.equal(201);
    });
    it('should return 400 if provide with invalid data', async () => {
      let result = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({ email: 'john', password: 'password' });
      expect(result.status).to.equal(400);
    });
    it('should return 400 if provided with already existing email', async () => {
      let result = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(validUser);
      expect(result.status).to.equal(400);
    });
  });

  describe('POST /signin', () => {
    it('should return 200 if successful login', async () => {
      let result = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send(validLogin);
      expect(result.status).to.equal(200);
    });
    it('should return 400 if provided with no values', async () => {
      let result = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send({});
      expect(result.status).to.equal(400);
    });
    it('should return 400 if provided with invalid credential', async () => {
      let result = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send({ email: 'demo@demo.com', password: 'demopassword' });
      expect(result.status).to.equal(400);
    });
    it('should return 400 if provided with valid email but wrong password', async () => {
      let result = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send({ ...validLogin, password: 'secret45' });
      expect(result.status).to.equal(400);
    });
  });
});
