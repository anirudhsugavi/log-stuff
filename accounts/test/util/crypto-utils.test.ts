import { hashPassword, comparePassword } from '../../src/util/crypto-utils';

const TEST_PLAIN = 'test1234';

describe('Hash password validation', () => {
  it('valid hashing', async () => {
    const hashed = await hashPassword(TEST_PLAIN);
    expect(comparePassword(TEST_PLAIN, hashed)).toBeTruthy();
  });
});
