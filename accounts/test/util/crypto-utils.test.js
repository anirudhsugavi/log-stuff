const {
  hashPassword, comparePassword, generateJwt, verifyJwt,
} = require('../../src/util/crypto-util');
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

describe('JWT validation', () => {
  const TEST_OBJ = { id: '123ab', secret: TEST_PLAIN, roles: ['admin'] };
  it('valid JWT', async () => {
    const token = await generateJwt(TEST_OBJ);
    expect(await verifyJwt({ token, secret: TEST_PLAIN })).toBeTruthy();
  });

  it('invalid secret', async () => {
    const token = await generateJwt(TEST_OBJ);
    await expect(verifyJwt({ token, secret: 'invalid secret' })).rejects.toThrowError();
  });

  it('invalid token', async () => {
    const token = 'ey.SomeINvalid123.@string';
    await expect(verifyJwt({ token, secret: TEST_PLAIN })).rejects.toThrowError();
  });

  it.each([
    '', '    ', undefined, null,
  ])('when token is "%s"', (token) => {
    expect(() => verifyJwt({ token })).toThrowError(BadRequestError);
  });

  it.each([
    '', '   ', undefined, null,
  ])('when secret is "%s"', (secret) => {
    expect(() => generateJwt({ id: '123', secret, roles: [] })).toThrowError(BadRequestError);
  });
});
