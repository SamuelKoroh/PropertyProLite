import request from 'supertest';
import { expect } from 'chai';
import app from '../server/app';
import { validUser } from './testdata/auth';

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
      const filePath = `${__dirname}/testdata/user.png`;
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
      const filePath = `${__dirname}/testdata/badimage.txt`;
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
});
