const { hashPassword, comparePassword } = require('../../src/util/crypto-util');
const { BadRequestError } = require('../../src/util/app-errors');

const TEST_PLAIN = 'test1234';

describe('Hash password validation', () => {
  it('valid password', async () => {
    const hashed = await hashPassword(TEST_PLAIN);
    expect(await comparePassword(TEST_PLAIN, hashed)).toBe(true);
  });

  it('invalid password', async () => {
    const hashed = await hashPassword(TEST_PLAIN);
    expect(await comparePassword('incorrect', hashed)).toBe(false);
  });

  it.each([
    '', '  ', undefined, null,
  ])('when plain password is "%s"', async (password) => {
    await expect(hashPassword(password)).rejects.toThrowError(BadRequestError);
  });

  it('no password', async () => {
    await expect(hashPassword()).rejects.toThrowError(BadRequestError);
  });
});
