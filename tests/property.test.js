import request from 'supertest';
import { expect } from 'chai';
import app from '../server/app';
import { validUser } from './testdata/auth';
import { validProperty } from './testdata/property';

describe('/api/v1/property', () => {
  const filePath = `${__dirname}/testdata/house.png`;

  let agent = '';
  let agent2 = '';
  let property1 = '';
  before(async () => {
    await request(app)
      .post('/api/v1/auth/signup')
      .send({ ...validUser, email: 'test@gmail.com' });

    agent = await request(app)
      .post('/api/v1/auth/signup')
      .send({ ...validUser, email: 'agent@gmail.com' });

    agent2 = await request(app)
      .post('/api/v1/auth/signup')
      .send({ ...validUser, email: 'agent2@gmail.com' });

    property1 = await request(app)
      .post('/api/v1/property')
      .set('token', agent.body.data.token)
      .send(validProperty);
  });
  describe('POST /', async () => {
    it('should return 201 if the property details is valid without images', async () => {
      expect(property1.status).to.equal(201);
    });
    it('should return 201 if the property details is valid and has one or more image', async () => {
      const result = await request(app)
        .post('/api/v1/property')
        .set('token', agent.body.data.token)
        .field('title', '45 rooms duplex in agodi')
        .field('price', 400000)
        .field('state', 'Ibadan')
        .field('city', 'Ojoo')
        .field('address', '20 agodi oojoo')
        .field('type', '45 rooms in a duples')
        .field('billing_type', 'per year')
        .field('description', 'Nice one')
        .field('deal_type', 'for sale')
        .attach('image_url', filePath);
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
        .set('token', 'invalidToken')
        .send(validProperty);
      expect(result.status).to.equal(400);
    });

    it('should return 400 if the property details is not valid', async () => {
      const result = await request(app)
        .post('/api/v1/property')
        .set('token', agent.body.data.token)
        .send({ ...validProperty, title: '' });
      expect(result.status).to.equal(400);
    });
    // it('should return 400 if the property already exist', async () => {
    //   const result = await request(app)
    //     .post('/api/v1/property')
    //     .set('token', agent.body.data.token)
    //     .send(validProperty);
    //   expect(result.status).to.equal(400);
    // });
  });
  describe('GET /', () => {
    it('should return 200 if there is property but no query string provide', async () => {
      const result = await request(app)
        .get('/api/v1/property')
        .set('token', agent.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('should return 200 if passed price query string', async () => {
      const result = await request(app)
        .get('/api/v1/property?price=500000')
        .set('token', agent.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('should return 200 if passed location query string', async () => {
      const result = await request(app)
        .get('/api/v1/property?location=Warri')
        .set('token', agent.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('should return 200 if passed deal query string', async () => {
      const result = await request(app)
        .get('/api/v1/property?deal=for rent')
        .set('token', agent.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('should return 200 if passed type query string', async () => {
      const result = await request(app)
        .get('/api/v1/property?type=2 bedroom')
        .set('token', agent.body.data.token);
      expect(result.status).to.equal(200);
    });
    it('should return 404 if no property is found', async () => {
      const result = await request(app)
        .get('/api/v1/property?location=2 bedroom')
        .set('token', agent.body.data.token);
      expect(result.status).to.equal(404);
    });
  });
  describe('GET /:property_id', () => {
    it('it should return 404 if property is not found', async () => {
      const result = await request(app)
        .get('/api/v1/property/50000')
        .set('token', agent.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('it should return 200 if property is  found', async () => {
      const result = await request(app)
        .get(`/api/v1/property/${property1.body.data.id}`)
        .set('token', agent.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('PATCH /:property_id', () => {
    let property;
    before(async () => {
      property = await request(app)
        .post('/api/v1/property')
        .set('token', agent.body.data.token)
        .send({ ...validProperty, title: '5 room duplex in abuja' });
    });
    it('should return 404 if the property does not exist', async () => {
      const result = await request(app)
        .patch('/api/v1/property/100')
        .set('token', agent.body.data.token)
        .send({ price: 200 });
      expect(result.status).to.equal(404);
    });
    // it('should return 403 if the property does not belong to the user', async () => {
    //   const result = await request(app)
    //     .patch(`/api/v1/property/${property.body.data.id}`)
    //     .set('token', agent2.body.data.token)
    //     .send({ price: 200 });
    //   expect(result.status).to.equal(403);
    // });
    it('should return 200 if the property does exist and belong to the user and was updated', async () => {
      const res = await request(app)
        .patch(`/api/v1/property/${property.body.data.id}`)
        .set('token', agent.body.data.token)
        .field('price', 200000);
      expect(res.status).to.equal(200);
    });
    it('should return 200 if the property does exist and belong to the user and its image was updated', async () => {
      const res = await request(app)
        .patch(`/api/v1/property/${property.body.data.id}`)
        .set('token', agent.body.data.token)
        .attach('image_url', filePath);
      expect(res.status).to.equal(200);
    });
  });
  describe('PATCH /:property_id/sold', () => {
    it('should return 404 if the property does not exist', async () => {
      const result = await request(app)
        .patch('/api/v1/property/10000/sold')
        .set('token', agent.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if the property does exist and belong to the user and was marked as sold', async () => {
      const result = await request(app)
        .patch(`/api/v1/property/${property1.body.data.id}/sold`)
        .set('token', agent.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('PATCH /:property_id/activate', () => {
    let property;
    let admin;
    before(async () => {
      property = await request(app)
        .post('/api/v1/property')
        .set('token', agent.body.data.token)
        .send({ ...validProperty, title: '54 room duplex in abuja' });
      admin = await request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send({ email: 'admin@gmail.com', password: 'admin' });
    });
    it('should return 403 if the user is not an admin', async () => {
      const result = await request(app)
        .patch(`/api/v1/property/${property.body.data.id}/activate`)
        .set('token', agent2.body.data.token);
      expect(result.status).to.equal(403);
    });

    it('should return 404 if the property does not exist', async () => {
      const result = await request(app)
        .patch('/api/v1/property/1000/activate')
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if the property does exist and the operation was successful', async () => {
      const result = await request(app)
        .patch(`/api/v1/property/${property.body.data.id}/activate`)
        .set('token', admin.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
  describe('DELETE /:property_id', () => {
    let property;
    before(async () => {
      property = await request(app)
        .post('/api/v1/property')
        .set('token', agent.body.data.token)
        .send({ ...validProperty, title: '12 room duplex in abuja' });
    });
    it('should return 404 if the property does not exist', async () => {
      const result = await request(app)
        .delete('/api/v1/property/100')
        .set('token', agent.body.data.token);
      expect(result.status).to.equal(404);
    });
    it('should return 200 if the property to be delete does exist and belong to the user', async () => {
      const result = await request(app)
        .delete(`/api/v1/property/${property.body.data.id}`)
        .set('token', agent.body.data.token);
      expect(result.status).to.equal(200);
    });
  });
});
