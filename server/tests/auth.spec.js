import { expect } from 'chai';
import request from 'supertest';
import app from '../app';
import { validUser, duplicateEmail, invalidPassword, validLogin } from '../testdata/auth';

describe('Auth', () => {
  describe('POST signup /', () => {
    describe('Check for errors', () => {
      it('it should return status code 400', async () => {
        let result = await request(app)
          .post('/api/v1/auth/signup')
          .send({ name: 'samuel' });
        expect(result.status).to.equal(400);
      });
    });
    describe('Check Duplicate Email', () => {
      before(async () => {
        await request(app)
          .post('/api/v1/auth/signup')
          .send(duplicateEmail);
      });
      it('it should email already registered', async () => {
        let result = await request(app)
          .post('/api/v1/auth/signup')
          .send(duplicateEmail);
        expect(result.body.error).to.equal('This email has been registered already');
      });
    });
    describe('Sign up without image been uploaded', () => {
      it('it should return status "success"', async () => {
        let result = await request(app)
          .post('/api/v1/auth/signup')
          .send(validUser);
        expect(result.body.status).to.equal('success');
      });
    });
  });
  describe('POST signin', () => {
    describe('Invalid Credential', () => {
      it('should return status code of 400 if username or password is empty', async () => {
        let result = await request(app)
          .post('/api/v1/auth/signin')
          .set('content-type', 'application/json')
          .send({});
        expect(result.statusCode).to.equal(400);
      });
      it('should return status code of 400 if password invalid', async () => {
        let result = await request(app)
          .post('/api/v1/auth/signin')
          .set('content-type', 'application/json')
          .send(invalidPassword);
        expect(result.statusCode).to.equal(400);
      });
    });
    describe('Valid Credential', () => {
      it('should return status code of 200 if pass valid credentials', async () => {
        let result = await request(app)
          .post('/api/v1/auth/signin')
          .set('content-type', 'application/json')
          .send(validLogin);
        expect(result.statusCode).to.equal(200);
      });
    });
  });
});
