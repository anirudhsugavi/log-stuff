const { BadRequestError, UnauthenticatedError, UnauthorizedError } = require('../../src/util/app-errors');
const { EXPIRES_IN, TOKEN_ISSUER, TOKEN_TYPE } = require('../../src/util/constants');
const { comparePassword, generateJwt, verifyJwt } = require('../../src/util/crypto-util');
const { createToken, authenticateUser } = require('../../src/services/auth-service');
const { getUser } = require('../../src/services/user-service');

jest.mock('../../src/services/user-service', () => ({
  getUser: jest.fn(),
}));

jest.mock('../../src/util/crypto-util', () => ({
  comparePassword: jest.fn(),
  generateJwt: jest.fn(),
  verifyJwt: jest.fn(),
}));

describe('Test create token', () => {
  const TEST_ID = '123abc';
  const TEST_PASS = 'hashed_password';
  const MOCK_USER = { _id: TEST_ID, password: TEST_PASS };

  it('incorrect password', async () => {
    getUser.mockImplementation(() => Promise.resolve(MOCK_USER));
    comparePassword.mockImplementation(() => Promise.resolve(false));

    const createTokenPromise = createToken({ _id: TEST_ID, password: 'incorrect' });
    await expect(createTokenPromise).rejects.toThrowError(BadRequestError);
    await expect(createTokenPromise).rejects.toThrow('incorrect password');
    expect(getUser).toHaveBeenCalledWith({ _id: TEST_ID }, true);
    expect(comparePassword).toHaveBeenCalledWith('incorrect', TEST_PASS);
  });

  it('invalid roles', async () => {
    getUser.mockImplementation(() => Promise.resolve(MOCK_USER));
    comparePassword.mockImplementation(() => Promise.resolve(true));

    const createTokenPromise = createToken({
      _id: TEST_ID, password: TEST_PASS, requiredRoles: [],
    });
    await expect(createTokenPromise).rejects.toThrowError(BadRequestError);
    await expect(createTokenPromise).rejects.toThrow('invalid roles');
    expect(getUser).toHaveBeenCalledWith({ _id: TEST_ID }, true);
    expect(comparePassword).toHaveBeenCalledWith(TEST_PASS, TEST_PASS);
  });

  it('valid token creation - with roles', async () => {
    getUser.mockImplementation(() => Promise.resolve(MOCK_USER));
    comparePassword.mockImplementation(() => Promise.resolve(true));
    generateJwt.mockImplementation(() => Promise.resolve('validJwtToken'));

    const createTokenPromise = createToken({
      _id: TEST_ID, password: TEST_PASS, requiredRoles: ['admin'],
    });
    expect(await createTokenPromise).toEqual({
      tokenType: TOKEN_TYPE, accessToken: 'validJwtToken', expiresIn: EXPIRES_IN, issuer: TOKEN_ISSUER,
    });
    expect(getUser).toHaveBeenCalledWith({ _id: TEST_ID }, true);
    expect(comparePassword).toHaveBeenCalledWith(TEST_PASS, TEST_PASS);
  });

  it('valid token creation - without roles', async () => {
    getUser.mockImplementation(() => Promise.resolve({ ...MOCK_USER, roles: ['read', 'write'] }));
    comparePassword.mockImplementation(() => Promise.resolve(true));
    generateJwt.mockImplementation(() => Promise.resolve('validJwtToken'));

    const createTokenPromise = createToken({
      _id: TEST_ID, password: TEST_PASS,
    });
    expect(await createTokenPromise).toEqual({
      tokenType: TOKEN_TYPE, accessToken: 'validJwtToken', expiresIn: EXPIRES_IN, issuer: TOKEN_ISSUER,
    });
    expect(getUser).toHaveBeenCalledWith({ _id: TEST_ID }, true);
    expect(comparePassword).toHaveBeenCalledWith(TEST_PASS, TEST_PASS);
  });
});

describe('Test authenticate user', () => {
  const TEST_TOKEN = 'testJwt.Token';
  const TEST_ROLES = ['read', 'write'];
  const MOCK_AUTH = { token: TEST_TOKEN, requiredRoles: TEST_ROLES };

  it('unauthenticated', async () => {
    verifyJwt.mockImplementation(() => Promise.reject(new UnauthenticatedError({ description: 'invalid signature' })));

    const authPromise = authenticateUser(MOCK_AUTH);
    await expect(authPromise).rejects.toThrowError(UnauthenticatedError);
    await expect(authPromise).rejects.toThrow('invalid signature');
    expect(verifyJwt).toHaveBeenCalled();
  });

  it('unauthorized', async () => {
    verifyJwt.mockImplementation(() => Promise.resolve({ roles: TEST_ROLES }));

    const authPromise = authenticateUser({ token: TEST_TOKEN, requiredRoles: ['delete'] });
    await expect(authPromise).rejects.toThrowError(UnauthorizedError);
    await expect(authPromise).rejects.toThrow('access denied');
    expect(verifyJwt).toHaveBeenCalled();
  });

  it('admin role - success', async () => {
    verifyJwt.mockImplementation(() => Promise.resolve({ id: '123', roles: ['admin'] }));

    expect(await authenticateUser(MOCK_AUTH)).toEqual({ id: '123', roles: ['admin'] });
    expect(verifyJwt).toHaveBeenCalled();
  });

  it('custom roles - success', async () => {
    verifyJwt.mockImplementation(() => Promise.resolve({ id: '123', roles: TEST_ROLES }));

    expect(await authenticateUser({ token: TEST_TOKEN })).toEqual({ id: '123', roles: TEST_ROLES });
    expect(verifyJwt).toHaveBeenCalled();
  });
});
