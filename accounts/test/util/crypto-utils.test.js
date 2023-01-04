import { hashPassword, comparePassword } from '../../src/util/crypto-util';
import { BadRequestError } from '../../src/util/app-errors';

const TEST_PLAIN = 'test1234';

describe('Hash password validation', () => {
  it('valid password', async () => {
    const hashed = await hashPassword(TEST_PLAIN);
    expect(await comparePassword(TEST_PLAIN, hashed)).tobe(true);
  });

  it('invalid password', async () => {
    const hashed = await hashPassword(TEST_PLAIN);
    // const result = await comparePassword('incorrect', hashed);
    // expect(result).toBeFalsy();
    expect(await comparePassword('incorrect', hashed)).tobe(false);
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
