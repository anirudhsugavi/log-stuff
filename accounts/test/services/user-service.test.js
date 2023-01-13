const {
  createUser, getUser, updateUser, deleteUser,
} = require('../../src/services/user-service');
const { BadRequestError, NotFoundError } = require('../../src/util/app-errors');
const userRepo = require('../../src/db/repositories/user-repository');
const validator = require('../../src/validator');

jest.mock('../../src/db/repositories/user-repository');
jest.mock('../../src/validator');

function setupInputValidators() {
  validator.isValidEmail.mockImplementation(() => true);
  validator.isStrongPassword.mockImplementation(() => true);
  validator.isValidUsername.mockImplementation(() => true);
  validator.isValidRoles.mockImplementation(() => true);
  validator.isValidId.mockImplementation(() => true);
}

describe('Test create user', () => {
  beforeEach(() => setupInputValidators());

  it('invalid email', async () => {
    validator.isValidEmail.mockImplementation(() => false);
    const createUserPromise = createUser({ email: 'invalid@email' });
    await expect(createUserPromise).rejects.toThrowError(BadRequestError);
    await expect(createUserPromise).rejects.toThrow('invalid email');
    expect(validator.isValidEmail).toHaveBeenCalled();
  });

  it('invalid password', async () => {
    validator.isStrongPassword.mockImplementation(() => false);

    const createUserPromise = createUser({ email: 'test@logstuff.com', password: 'notstrong' });
    await expect(createUserPromise).rejects.toThrowError(BadRequestError);
    await expect(createUserPromise).rejects.toThrow('password does not meet requirements');
    expect(validator.isStrongPassword).toHaveBeenCalled();
  });

  it('invalid roles', async () => {
    validator.isValidRoles.mockImplementation(() => false);

    const createUserPromise = createUser({ roles: ['invalid'] });
    await expect(createUserPromise).rejects.toThrowError(BadRequestError);
    await expect(createUserPromise).rejects.toThrow('invalid roles');
    expect(validator.isValidRoles).toHaveBeenCalled();
  });

  it('invalid username', async () => {
    validator.isValidUsername.mockImplementation(() => false);

    const createUserPromise = createUser({ username: 'invalid$username' });
    await expect(createUserPromise).rejects.toThrowError(BadRequestError);
    await expect(createUserPromise).rejects.toThrow('special characters not allowed in username');
    expect(validator.isValidUsername).toHaveBeenCalled();
  });

  it('duplicate email', async () => {
    userRepo.createUser.mockImplementation(() => Promise.reject(new Error('email already exists')));

    const createUserPromise = createUser({ email: 'exists@logstuff.com', password: 'pass' });
    await expect(createUserPromise).rejects.toThrowError();
    await expect(createUserPromise).rejects.toThrow('email already exists');
    expect(userRepo.createUser).toHaveBeenCalled();
  });

  it('successful creation', async () => {
    const user = {
      email: 'valid@logstuff.com',
      password: 'superStrong@#12',
      name: { first: 'Test', last: 'User' },
      roles: ['admin'],
    };
    const expectedUser = {
      _id: '123abc',
      email: user.email,
      username: user.email,
      name: user.name,
      roles: user.roles,
      verified: false,
      deleted: false,
    };
    userRepo.createUser.mockImplementation(() => Promise.resolve(expectedUser));

    const createUserPromise = createUser(user);
    expect(await createUserPromise).toEqual(expectedUser);
    expect(userRepo.createUser).toHaveBeenCalled();
  });
});

describe('Test get user', () => {
  beforeEach(() => setupInputValidators());

  const VALID_ID = '63baee02d0eac03bf99256ce';
  const INVALID_ID = '123abf';
  const VALID_EMAIL = 'testuser@logstuff.com';
  const INVALID_EMAIL = 'invalid@email';
  const VALID_USERNAME = 'testuser';
  const INVALID_USERNAME = 'test%^user';
  const expectedUser = {
    _id: VALID_ID,
    email: VALID_EMAIL,
    username: VALID_USERNAME,
    name: { first: 'Test', last: 'User' },
    roles: ['admin'],
    verified: false,
    deleted: false,
  };

  it('ID - invalid format', async () => {
    validator.isValidId.mockImplementation(() => false);

    const getUserPromise = getUser({ _id: INVALID_ID });
    await expect(getUserPromise).rejects.toThrowError(BadRequestError);
    await expect(getUserPromise).rejects.toThrow('invalid ID');
    expect(validator.isValidId).toHaveBeenCalled();
  });

  it('ID - not found', async () => {
    userRepo.getUser.mockImplementation(() => Promise.resolve());

    const getUserPromise = getUser({ _id: VALID_ID });
    await expect(getUserPromise).rejects.toThrowError(NotFoundError);
    await expect(getUserPromise).rejects.toThrow(`user with ID '${VALID_ID}' does not exist`);
    expect(userRepo.getUser).toHaveBeenCalled();
    expect(validator.isValidId).toHaveBeenCalled();
  });

  it('ID - success', async () => {
    userRepo.getUser.mockImplementation(() => Promise.resolve(expectedUser));

    const getUserPromise = getUser({ _id: VALID_ID });
    expect(await getUserPromise).toEqual(expectedUser);
    expect(userRepo.getUser).toHaveBeenCalled();
    expect(validator.isValidId).toHaveBeenCalled();
  });

  it('email - invalid format', async () => {
    validator.isValidEmail.mockImplementation(() => false);

    const getUserPromise = getUser({ email: INVALID_EMAIL });
    await expect(getUserPromise).rejects.toThrowError(BadRequestError);
    await expect(getUserPromise).rejects.toThrow('invalid email');
    expect(validator.isValidEmail).toHaveBeenCalled();
  });

  it('email - not found', async () => {
    userRepo.getUser.mockImplementation(() => Promise.resolve());

    const getUserPromise = getUser({ email: VALID_EMAIL });
    await expect(getUserPromise).rejects.toThrowError(NotFoundError);
    await expect(getUserPromise).rejects.toThrow(`user with email '${VALID_EMAIL}' does not exist`);
    expect(userRepo.getUser).toHaveBeenCalled();
    expect(validator.isValidEmail).toHaveBeenCalled();
  });

  it('email - success', async () => {
    userRepo.getUser.mockImplementation(() => Promise.resolve(expectedUser));

    const getUserPromise = getUser({ email: VALID_EMAIL });
    expect(await getUserPromise).toEqual(expectedUser);
    expect(userRepo.getUser).toHaveBeenCalled();
    expect(validator.isValidEmail).toHaveBeenCalled();
  });

  it('username - invalid format', async () => {
    validator.isValidUsername.mockImplementation(() => false);

    const getUserPromise = getUser({ username: INVALID_USERNAME });
    await expect(getUserPromise).rejects.toThrowError(BadRequestError);
    await expect(getUserPromise).rejects.toThrow('special characters not allowed in username');
    expect(validator.isValidUsername).toHaveBeenCalled();
  });

  it('username - not found', async () => {
    userRepo.getUser.mockImplementation(() => Promise.resolve());

    const getUserPromise = getUser({ username: VALID_USERNAME });
    await expect(getUserPromise).rejects.toThrowError(NotFoundError);
    await expect(getUserPromise).rejects.toThrow(`user with username '${VALID_USERNAME}' does not exist`);
    expect(userRepo.getUser).toHaveBeenCalled();
    expect(validator.isValidUsername).toHaveBeenCalled();
  });

  it('username - success', async () => {
    userRepo.getUser.mockImplementation(() => Promise.resolve(expectedUser));

    const getUserPromise = getUser({ username: VALID_USERNAME });
    expect(await getUserPromise).toEqual(expectedUser);
    expect(userRepo.getUser).toHaveBeenCalled();
    expect(validator.isValidUsername).toHaveBeenCalled();
  });
});
