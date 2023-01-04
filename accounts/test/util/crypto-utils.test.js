import { hashPassword, comparePassword } from '../../src/util/crypto-util';
import { BadRequestError } from '../../src/util/app-errors';

const TEST_PLAIN = 'test1234';

describe('Hash password validation', () => {
  it('valid hashing', async () => {
    const hashed = await hashPassword(TEST_PLAIN);
    expect(comparePassword(TEST_PLAIN, hashed)).toBeTruthy();
  });

  it.each([
    '', '  ']
  )('when plain password is "%s"', async (password) => {
    try {
      await hashPassword(password);
    } catch (err) {
      if (err instanceof BadRequestError) {
        expect(err.message).toEqual('argument is empty');
      }
    }
  });
});
