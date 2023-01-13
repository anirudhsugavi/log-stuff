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

    const createUserPromise = createUser({ email: 'test@example.com', password: 'notstrong' });
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

    const createUserPromise = createUser({ email: 'exists@test.com', password: 'pass' });
    await expect(createUserPromise).rejects.toThrowError();
    await expect(createUserPromise).rejects.toThrow('email already exists');
    expect(userRepo.createUser).toHaveBeenCalled();
  });

  it('successful creation', async () => {
    const user = {
      email: 'valid@example.com',
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
