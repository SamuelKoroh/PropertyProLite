import request from 'supertest';
import { expect } from 'chai';
import app from '../server/app';
import { validUser } from './testdata/auth';
import { validProperty } from './testdata/property';

describe('/api/v1/favourites', () => {
  let admin;
  let testUser2;
  let property1;
  let property2;
  before(async () => {
    admin = await request(app)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/json')
      .send({ email: 'admin@gmail.com', password: 'admin' });

    testUser2 = await request(app)
      .post('/api/v1/auth/signup')
      .set('content-type', 'application/json')
      .send({
        ...validUser,
        email: 'testuser2@test.com',
        first_name: 'testuser2',
        last_name: 'unittest'
      });

    property1 = await request(app)
      .post('/api/v1/property')
      .set('x-auth-token', admin.body.data.token)
      .send({ ...validProperty, title: '12 bedroom flat' });
  });

  describe('POST /:propertyId', () => {
    it('should return 200 if the property was added to his/her favourite list', async () => {
      const result = await request(app)
        .post(`/api/v1/favourites/${property1.body.data.id}`)
        .set('x-auth-token', testUser2.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('should return 400 if the property is already added to the favourite list', async () => {
      const result = await request(app)
        .post(`/api/v1/favourites/${property1.body.data.id}`)
        .set('x-auth-token', testUser2.body.data.token);
      expect(result.status).to.equal(400);
    });
  });
  describe('GET /', () => {
    before(async () => {
      property1 = await request(app)
        .post('/api/v1/property')
        .set('x-auth-token', admin.body.data.token)
        .send({ ...validProperty, title: '1552 bedroom flat' });

      property2 = await request(app)
        .post('/api/v1/property')
        .set('x-auth-token', admin.body.data.token)
        .send({ ...validProperty, title: '12542 bedroom flat' });

      await request(app)
        .post(`/api/v1/favourites/${property1.body.data.id}`)
        .set('x-auth-token', testUser2.body.data.token);

      await request(app)
        .post(`/api/v1/favourites/${property2.body.data.id}`)
        .set('x-auth-token', testUser2.body.data.token);
    });
    it('should return 404 if the user favourite list is empty', async () => {
      const result = await request(app)
        .get('/api/v1/favourites')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if the user favourite list is loaded successfully', async () => {
      const result = await request(app)
        .get('/api/v1/favourites')
        .set('x-auth-token', testUser2.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
});
