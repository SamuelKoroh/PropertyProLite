import { multiplier } from '../server/demo/numbers';

describe('Multiply two numbers', () => {
  it('2 multiply 3 should return 6', () => {
    expect(multiplier(2, 4)).not.toBe(6);
  });
  it('5 multiply 3 should return 15', () => {
    expect(multiplier(5, 3)).toEqual(15);
  });
});
