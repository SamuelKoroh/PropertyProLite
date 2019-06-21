import chai, { expect } from 'chai';
import path from 'path';
import chaiHttp from 'chai-http';
// import request from 'supertest';
import app from '../app';
import {
  validUser,
  validUserWithImage,
  duplicateEmail
} from '../testdata/auth';

chai.use(chaiHttp);

describe('Auth', () => {
  describe('POST signup /', () => {
    describe('Check for errors', () => {
      it('it should return status code 400', async () => {
        let result = await chai
          .request(app)
          .post('/api/v1/auth/signup')
          .send({ name: 'samuel' });
        expect(result.status).to.equal(400);
      });
    });
    describe('Check Duplicate Email', () => {
      before(async () => {
        await chai
          .request(app)
          .post('/api/v1/auth/signup')
          .send(duplicateEmail);
      });
      it('it should email already registered', async () => {
        let result = await chai
          .request(app)
          .post('/api/v1/auth/signup')
          .send(duplicateEmail);
        expect(result.body.error).to.equal(
          'This email has been registered already'
        );
      });
    });
    describe('Sign up without image been uploaded', () => {
      it('it should return status "success"', async () => {
        let result = await chai
          .request(app)
          .post('/api/v1/auth/signup')
          .send(validUser);
        expect(result.body.status).to.equal('success');
      });
    });
  });
});
