import { expect } from 'chai';
import request from 'supertest';
import app from '../server/app';

describe('Other function test', () => {
  describe('Redirect', () => {
    it('should return 302 onces redirect', async () => {
      const res = await request(app).get('/');
      expect(res.status).to.equal(302);
    });
  });
});
