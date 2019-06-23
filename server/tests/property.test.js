import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { validUser } from '../testdata/auth';
import { validProperty } from '../testdata/property';

chai.use(chaiHttp);

describe('/api/v1/property', () => {
  let user = '';
  let agent = '';
  before(async () => {
    user = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({ ...validUser, email: 'test@gmail.com' });

    agent = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({ ...validUser, email: 'agent@gmail.com', user_type: 'agent' });
  });
  describe('POST /', async () => {
    it('should return 201 if the property details is valid', async () => {
      const result = await chai
        .request(app)
        .post('/api/v1/property')
        .set('x-auth-token', agent.body.data.token)
        .send(validProperty);
      expect(result.status).to.equal(201);
    });

    it('should return 401 if user has no token', async () => {
      const result = await chai
        .request(app)
        .post('/api/v1/property')
        .send(validProperty);
      expect(result.status).to.equal(401);
    });
    it('should return 400 if user has provide invalid token', async () => {
      const result = await chai
        .request(app)
        .post('/api/v1/property')
        .set('x-auth-token', 'invalidToken')
        .send(validProperty);
      expect(result.status).to.equal(400);
    });

    it('should return 403 if user is not an agent or admin', async () => {
      const result = await chai
        .request(app)
        .post('/api/v1/property')
        .set('x-auth-token', user.body.data.token)
        .send(validProperty);
      expect(result.status).to.equal(403);
    });

    it('should return 400 if the property details is not valid', async () => {
      const result = await chai
        .request(app)
        .post('/api/v1/property')
        .set('x-auth-token', agent.body.data.token)
        .send({ ...validProperty, title: '' });
      expect(result.status).to.equal(400);
    });
    it('should return 400 if the property already exist', async () => {
      const result = await chai
        .request(app)
        .post('/api/v1/property')
        .set('x-auth-token', agent.body.data.token)
        .send(validProperty);
      expect(result.status).to.equal(400);
    });
  });
  describe('GET /', () => {
    it('should return 200 if there is property but no query string provide', async () => {
      const result = await chai.request(app).get('/api/v1/property');
      expect(result.status).to.equal(200);
    });
    it('should return 200 if passed price query string', async () => {
      const result = await chai.request(app).get('/api/v1/property?price=500000');
      expect(result.status).to.equal(200);
    });
    it('should return 200 if passed location query string', async () => {
      const result = await chai.request(app).get('/api/v1/property?location=Warri');
      expect(result.status).to.equal(200);
    });
    it('should return 200 if passed deal query string', async () => {
      const result = await chai.request(app).get('/api/v1/property?location=for rent');
      expect(result.status).to.equal(200);
    });
    it('should return 200 if passed type query string', async () => {
      const result = await chai.request(app).get('/api/v1/property?type=2 bedroom');
      expect(result.status).to.equal(200);
    });
  });
});
