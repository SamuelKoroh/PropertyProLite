import { expect } from 'chai';
import { multiplier, sum } from '../demo/numbers';

describe('Multiply two numbers', () => {
  it('2 multiply 4 should return 6', () => {
    expect(sum(2, 4)).to.equal(6);
  });
  it('5 multiply 3 should return 15', () => {
    expect(multiplier(5, 3)).to.equal(15);
  });
});
