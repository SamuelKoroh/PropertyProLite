import request from 'supertest';
import { expect } from 'chai';
import app from '../app';
import { validUser } from '../testdata/auth';
import { validProperty } from '../testdata/property';

describe('/api/v1/property', () => {
  const filePath = `${__dirname}/stupid.jpg`;
  let user = '';
  let agent = '';
  let agent2 = '';
  before(async () => {
    user = await request(app)
      .post('/api/v1/auth/signup')
      .send({ ...validUser, email: 'test@gmail.com' });

    agent = await request(app)
      .post('/api/v1/auth/signup')
      .send({ ...validUser, email: 'agent@gmail.com', user_type: 'agent' });

    agent2 = await request(app)
      .post('/api/v1/auth/signup')
      .send({ ...validUser, email: 'agent2@gmail.com', user_type: 'agent' });
  });
  describe('POST /', async () => {
    it('should return 201 if the property details is valid without images', async () => {
      const result = await request(app)
        .post('/api/v1/property')
        .set('x-auth-token', agent.body.data.token)
        .send(validProperty);
      expect(result.status).to.equal(201);
    });
    it('should return 201 if the property details is valid and has one or more image', async () => {
      const result = await request(app)
        .post('/api/v1/property')
        .set('x-auth-token', agent.body.data.token)
        .field('title', '45 rooms duplex in agodi')
        .field('price', 400000)
        .field('state', 'Ibadan')
        .field('city', 'Ojoo')
        .field('address', '20 agodi oojoo')
        .field('type', '45 rooms in a duples')
        .field('billing_type', 'per year')
        .field('description', 'Nice one')
        .field('deal_type', 'for sale')
        .attach('images', filePath);
      expect(result.status).to.equal(201);
    });
    it('should return 401 if user has no token', async () => {
      const result = await request(app)
        .post('/api/v1/property')
        .send(validProperty);
      expect(result.status).to.equal(401);
    });
    it('should return 400 if user has provide invalid token', async () => {
      const result = await request(app)
        .post('/api/v1/property')
        .set('x-auth-token', 'invalidToken')
        .send(validProperty);
      expect(result.status).to.equal(400);
    });

    it('should return 403 if user is not an agent or admin', async () => {
      const result = await request(app)
        .post('/api/v1/property')
        .set('x-auth-token', user.body.data.token)
        .send(validProperty);
      expect(result.status).to.equal(403);
    });

    it('should return 400 if the property details is not valid', async () => {
      const result = await request(app)
        .post('/api/v1/property')
        .set('x-auth-token', agent.body.data.token)
        .send({ ...validProperty, title: '' });
      expect(result.status).to.equal(400);
    });
    it('should return 400 if the property already exist', async () => {
      const result = await request(app)
        .post('/api/v1/property')
        .set('x-auth-token', agent.body.data.token)
        .send(validProperty);
      expect(result.status).to.equal(400);
    });
  });
  describe('GET /', () => {
    it('should return 200 if there is property but no query string provide', async () => {
      const result = await request(app).get('/api/v1/property');
      expect(result.status).to.equal(200);
    });
    it('should return 200 if passed price query string', async () => {
      const result = await request(app).get('/api/v1/property?price=500000');
      expect(result.status).to.equal(200);
    });
    it('should return 200 if passed location query string', async () => {
      const result = await request(app).get('/api/v1/property?location=Warri');
      expect(result.status).to.equal(200);
    });
    it('should return 200 if passed deal query string', async () => {
      const result = await request(app).get('/api/v1/property?deal=for rent');
      expect(result.status).to.equal(200);
    });
    it('should return 200 if passed type query string', async () => {
      const result = await request(app).get('/api/v1/property?type=2 bedroom');
      expect(result.status).to.equal(200);
    });
    it('should return 404 if no property is found', async () => {
      const result = await request(app).get('/api/v1/property?location=2 bedroom');
      expect(result.status).to.equal(404);
    });
  });
  describe('GET /:propertyId', () => {
    it('it should return 404 if property is not found', async () => {
      const result = await request(app).get('/api/v1/property/50000');
      expect(result.status).to.equal(404);
    });
    it('it should return 200 if property is  found', async () => {
      const result = await request(app).get('/api/v1/property/1');
      expect(result.status).to.equal(200);
    });
  });
  describe('PATCH /:propertyId/sold', () => {
    it('should return 404 if the property does not exist', async () => {
      const result = await request(app)
        .patch('/api/v1/property/100')
        .set('x-auth-token', agent.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 403 if the property does not belong to the user', async () => {
      const result = await request(app)
        .patch('/api/v1/property/1/sold')
        .set('x-auth-token', agent2.body.data.token);
      expect(result.status).to.equal(403);
    });
    it('should return 200 if the property does exist and belong to the user and was marked as sold', async () => {
      const result = await request(app)
        .patch('/api/v1/property/1/sold')
        .set('x-auth-token', agent.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('PATCH /:propertyId', () => {
    it('should return 404 if the property does not exist', async () => {
      const result = await request(app)
        .patch('/api/v1/property/100')
        .set('x-auth-token', agent.body.data.token)
        .send({ price: 200 });
      expect(result.status).to.equal(404);
    });
    it('should return 403 if the property does not belong to the user', async () => {
      const result = await request(app)
        .patch('/api/v1/property/1')
        .set('x-auth-token', agent2.body.data.token)
        .send({ price: 200 });
      expect(result.status).to.equal(403);
    });
    it('should return 200 if the property does exist and belong to the user and was updated', async () => {
      const result = await request(app)
        .patch('/api/v1/property/1')
        .set('x-auth-token', agent.body.data.token)
        .send({ price: 200 });
      expect(result.status).to.equal(200);
    });
    it('should return 200 if the property does exist and belong to the user and its image was updated', async () => {
      const res = await request(app)
        .patch('/api/v1/property/1')
        .set('x-auth-token', agent.body.data.token)
        .attach('images', filePath);
      expect(res.status).to.equal(200);
    });
  });
  describe('DELETE /:propertyId', () => {
    it('should return 404 if the property does not exist', async () => {
      const result = await request(app)
        .delete('/api/v1/property/100')
        .set('x-auth-token', agent.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 403 if the property does not belong to the user', async () => {
      const result = await request(app)
        .delete('/api/v1/property/1')
        .set('x-auth-token', agent2.body.data.token);
      expect(result.status).to.equal(403);
    });
    it('should return 200 if the property to be delete does exist and belong to the user', async () => {
      const result = await request(app)
        .delete('/api/v1/property/1')
        .set('x-auth-token', agent.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
});

describe('/api/v1/flag', () => {
  let admin = '';
  let flaged = '';
  before(async () => {
    admin = await request(app)
      .post('/api/v1/auth/signin')
      .set('Content-Type', 'application/json')
      .send({ email: 'admin@gmail.com', password: 'admin' });

    flaged = await request(app)
      .post('/api/v1/auth/signup')
      .field('email', 'agent@agent.com')
      .field('password', 'agent')
      .field('first_name', 'Ibadan')
      .field('last_name', 'Ojoo')
      .field('phone_number', '20 agodi oojoo')
      .field('address', '45 rooms in a duples')
      .field('user_type', 'per year');
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
  describe('GET /', () => {
    it('it should return 403 if the user acces is forbidden', async () => {
      const result = await request(app)
        .get('/api/v1/flag')
        .set('x-auth-token', flaged.body.data.token);
      expect(result.status).to.equal(403);
    });
    it('it should return 404 if there are no record returned by using query parameter', async () => {
      const result = await request(app)
        .get('/api/v1/flag?search=hhhhhhhhhhhhhhhhhh')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('it should return 200 if there are one or more records by using name query string', async () => {
      const result = await request(app)
        .get('/api/v1/flag?search=sarah')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('it should return 200 if there are one or more records by using reason query string', async () => {
      const result = await request(app)
        .get('/api/v1/flag?search=wierd')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('it should return 200 if there are one or more records by using email query string', async () => {
      const result = await request(app)
        .get('/api/v1/flag?search=reporter')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('it should return 200 if there are one or more records', async () => {
      const result = await request(app)
        .get('/api/v1/flag')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });

  describe('GET /:flagId', () => {
    it('it should return 404 if there is no matching record', async () => {
      const result = await request(app)
        .get('/api/v1/flag/10000')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('it should return 200 if there is matching record', async () => {
      const result = await request(app)
        .get('/api/v1/flag/1')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('DELETE /:flagId', () => {
    it('it should return 404 if there is no matching record', async () => {
      const result = await request(app)
        .delete('/api/v1/flag/10000')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });

    it('should return 200 successfully remove the flag', async () => {
      const result = await request(app)
        .delete('/api/v1/flag/1')
        .set('x-auth-token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
});

// Favourites Test

describe('/api/v1/favourites', () => {
  let admin;
  let testUser2;
  let property1;
  let property2;
  let favourite1;
  let favourite2;
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
    it('should return 200 if the property was removed from the favourite list', async () => {
      const result = await request(app)
        .post(`/api/v1/favourites/${property1.body.data.id}`)
        .set('x-auth-token', testUser2.body.data.token);
      expect(result.status).to.equal(200);
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

      favourite1 = await request(app)
        .post(`/api/v1/favourites/${property1.body.data.id}`)
        .set('x-auth-token', testUser2.body.data.token);

      favourite2 = await request(app)
        .post(`/api/v1/favourites/${property2.body.data.id}`)
        .set('x-auth-token', testUser2.body.data.token);
    });

    it('should return 200 if the user favourite list is loaded successfully', async () => {
      const result = await request(app)
        .get('/api/v1/favourites')
        .set('x-auth-token', testUser2.body.data.token);
      expect(result.status).to.equal(200);
    });
  });

  describe('DELETE /:favouriteId', () => {
    it('should return 404 if the property does not exist in the favourite list', async () => {
      const result = await request(app)
        .delete('/api/v1/favourites/10000000')
        .set('x-auth-token', testUser2.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if the property was removed from the favourite list', async () => {
      const result = await request(app)
        .delete('/api/v1/favourites/1')
        .set('x-auth-token', testUser2.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
});
