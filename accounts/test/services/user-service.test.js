const {
  createUser, getUser, updateUser, deleteUser,
} = require('../../src/services/user-service');
const { BadRequestError, NotFoundError } = require('../../src/util/app-errors');
const userRepo = require('../../src/db/repositories/user-repository');
const validator = require('../../src/validator');
const crypto = require('../../src/util/crypto-util');

jest.mock('../../src/db/repositories/user-repository');
jest.mock('../../src/validator');
jest.mock('../../src/util/crypto-util');

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

  it('username - success, with password', async () => {
    userRepo.getUserWithPassword.mockImplementation(() => Promise.resolve({ ...expectedUser, password: 'hashed_pass' }));

    const getUserPromise = getUser({ username: VALID_USERNAME }, true);
    expect(await getUserPromise).toEqual({ ...expectedUser, password: 'hashed_pass' });
    expect(userRepo.getUserWithPassword).toHaveBeenCalled();
    expect(validator.isValidUsername).toHaveBeenCalled();
  });

  it('nothing/invalid key passed', async () => {
    const getUserPromise = getUser({});
    await expect(getUserPromise).rejects.toThrowError(BadRequestError);
    await expect(getUserPromise).rejects.toThrow('user ID, email, or username is required');
  });
});

describe('Test delete user', () => {
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

    const deleteUserPromise = deleteUser({ _id: INVALID_ID });
    await expect(deleteUserPromise).rejects.toThrowError(BadRequestError);
    await expect(deleteUserPromise).rejects.toThrow('invalid ID');
    expect(validator.isValidId).toHaveBeenCalled();
  });

  it('ID - not found', async () => {
    userRepo.updateUser.mockImplementation(() => Promise.resolve());

    const deleteUserPromise = deleteUser({ _id: VALID_ID });
    await expect(deleteUserPromise).rejects.toThrowError(NotFoundError);
    await expect(deleteUserPromise).rejects.toThrow(`user with ID '${VALID_ID}' does not exist`);
    expect(userRepo.updateUser).toHaveBeenCalled();
    expect(validator.isValidId).toHaveBeenCalled();
  });

  it('ID - success', async () => {
    userRepo.updateUser.mockImplementation(() => Promise.resolve(expectedUser));

    const deleteUserPromise = deleteUser({ _id: VALID_ID });
    expect(await deleteUserPromise).toEqual(expectedUser);
    expect(userRepo.updateUser).toHaveBeenCalled();
    expect(validator.isValidId).toHaveBeenCalled();
  });

  it('email - invalid format', async () => {
    validator.isValidEmail.mockImplementation(() => false);

    const deleteUserPromise = deleteUser({ email: INVALID_EMAIL });
    await expect(deleteUserPromise).rejects.toThrowError(BadRequestError);
    await expect(deleteUserPromise).rejects.toThrow('invalid email');
    expect(validator.isValidEmail).toHaveBeenCalled();
  });

  it('email - not found', async () => {
    userRepo.updateUser.mockImplementation(() => Promise.resolve());

    const deleteUserPromise = deleteUser({ email: VALID_EMAIL });
    await expect(deleteUserPromise).rejects.toThrowError(NotFoundError);
    await expect(deleteUserPromise).rejects.toThrow(`user with email '${VALID_EMAIL}' does not exist`);
    expect(userRepo.updateUser).toHaveBeenCalled();
    expect(validator.isValidEmail).toHaveBeenCalled();
  });

  it('email - success', async () => {
    userRepo.updateUser.mockImplementation(() => Promise.resolve(expectedUser));

    const deleteUserPromise = deleteUser({ email: VALID_EMAIL });
    expect(await deleteUserPromise).toEqual(expectedUser);
    expect(userRepo.updateUser).toHaveBeenCalled();
    expect(validator.isValidEmail).toHaveBeenCalled();
  });

  it('username - invalid format', async () => {
    validator.isValidUsername.mockImplementation(() => false);

    const deleteUserPromise = deleteUser({ username: INVALID_USERNAME });
    await expect(deleteUserPromise).rejects.toThrowError(BadRequestError);
    await expect(deleteUserPromise).rejects.toThrow('special characters not allowed in username');
    expect(validator.isValidUsername).toHaveBeenCalled();
  });

  it('username - not found', async () => {
    userRepo.updateUser.mockImplementation(() => Promise.resolve());

    const deleteUserPromise = deleteUser({ username: VALID_USERNAME });
    await expect(deleteUserPromise).rejects.toThrowError(NotFoundError);
    await expect(deleteUserPromise).rejects.toThrow(`user with username '${VALID_USERNAME}' does not exist`);
    expect(userRepo.updateUser).toHaveBeenCalled();
    expect(validator.isValidUsername).toHaveBeenCalled();
  });

  it('username - success', async () => {
    userRepo.updateUser.mockImplementation(() => Promise.resolve(expectedUser));

    const deleteUserPromise = deleteUser({ username: VALID_USERNAME });
    expect(await deleteUserPromise).toEqual(expectedUser);
    expect(userRepo.updateUser).toHaveBeenCalled();
    expect(validator.isValidUsername).toHaveBeenCalled();
  });

  it('nothing/invalid key passed', async () => {
    const deleteUserPromise = deleteUser({});
    await expect(deleteUserPromise).rejects.toThrowError(BadRequestError);
    await expect(deleteUserPromise).rejects.toThrow('user ID, email, or username is required');
  });
});

describe('Test update user', () => {
  beforeEach(() => setupInputValidators());

  const VALID_ID = '63baee02d0eac03bf99256ce';
  const INVALID_ID = '123abf';
  const USERNAME = 'testuser';

  it('ID - invalid format', async () => {
    validator.isValidId.mockImplementation(() => false);

    const updateUserPromise = updateUser(INVALID_ID, {});
    await expect(updateUserPromise).rejects.toThrowError(BadRequestError);
    await expect(updateUserPromise).rejects.toThrow('invalid ID');
    expect(validator.isValidId).toHaveBeenCalled();
  });

  describe('invalid field type', () => {
    it.each([
      '', null, undefined, 'name', [],
    ])('when field is "%s"', async (field) => {
      const updateUserPromise = updateUser(VALID_ID, { fields: field });
      await expect(updateUserPromise).rejects.toThrowError(BadRequestError);
      await expect(updateUserPromise).rejects.toThrow('invalid update fields array');
      expect(validator.isValidId).toHaveBeenCalled();
    });
  });

  it('invalid upate field', async () => {
    const INVALID_FIELD = ['invalid_field'];
    const updateUserPromise = updateUser(VALID_ID, { fields: INVALID_FIELD });
    await expect(updateUserPromise).rejects.toThrowError(BadRequestError);
    await expect(updateUserPromise).rejects.toThrow(`invalid update user field '${INVALID_FIELD}'`);
    expect(validator.isValidId).toHaveBeenCalled();
  });

  it('username - not found', async () => {
    userRepo.getUser.mockImplementation(() => Promise.resolve());

    const updateUserPromise = updateUser(VALID_ID, { fields: ['username'], username: USERNAME });
    await expect(updateUserPromise).rejects.toThrowError(BadRequestError);
    await expect(updateUserPromise).rejects.toThrow('user does not exist');
    expect(validator.isValidId).toHaveBeenCalled();
    expect(validator.isValidUsername).toHaveBeenCalled();
  });

  describe('username - default to email', () => {
    it.each([
      '', '  ', null, undefined,
    ])('when username is "%s"', async (username) => {
      userRepo.getUser.mockImplementation(() => Promise.resolve({ email: 'test@logstuff.com' }));
      userRepo.updateUser.mockImplementation(() => Promise.resolve({}));

      const updateUserPromise = updateUser(VALID_ID, { fields: ['username'], username });
      expect(await updateUserPromise).toBeDefined();
      expect(userRepo.getUser).toHaveBeenCalled();
      expect(userRepo.updateUser).toHaveBeenCalled();
    });
  });

  it('successful update', async () => {
    userRepo.getUser.mockImplementation(() => Promise.resolve({}));
    userRepo.updateUser.mockImplementation(() => Promise.resolve({}));

    const updateUserPromise = updateUser(VALID_ID, {
      fields: ['username', 'name', 'settings'],
      username: USERNAME,
      name: {},
      settings: {},
    });
    expect(await updateUserPromise).toBeDefined();
    expect(userRepo.getUser).toHaveBeenCalled();
    expect(userRepo.updateUser).toHaveBeenCalled();
    expect(validator.isValidUsername).toHaveBeenCalled();
  });

  it('empty name object', async () => {
    const nameUpdatePromise = updateUser(VALID_ID, { fields: ['name'] });
    await expect(nameUpdatePromise).rejects.toThrowError(BadRequestError);
    await expect(nameUpdatePromise).rejects.toThrow('empty name for update');
  });

  it('name set & unset', async () => {
    userRepo.updateUser.mockImplementation(() => Promise.resolve({}));

    const nameUpdatePromise = updateUser(VALID_ID, {
      fields: ['name'],
      name: {
        first: 'test', nick: null, middle: '  ',
      },
    });
    expect(await nameUpdatePromise).toBeDefined();
    expect(userRepo.updateUser).toHaveBeenCalled();
  });

  it('empty settings object', async () => {
    const settingsUpdatePromise = updateUser(VALID_ID, { fields: ['settings'] });
    await expect(settingsUpdatePromise).rejects.toThrowError(BadRequestError);
    await expect(settingsUpdatePromise).rejects.toThrow('empty settings for update');
  });

  it('settings set & unset', async () => {
    userRepo.updateUser.mockImplementation(() => Promise.resolve({}));

    const settingsUpdatePromise = updateUser(VALID_ID, {
      fields: ['settings'],
      settings: {
        set1: 'test', set2: null, set3: '  ',
      },
    });
    expect(await settingsUpdatePromise).toBeDefined();
    expect(userRepo.updateUser).toHaveBeenCalled();
  });

  describe('email update', () => {
    it('empty email', async () => {
      const emailUpdatePromise = updateUser(VALID_ID, { fields: ['email'] });
      await expect(emailUpdatePromise).rejects.toThrowError(BadRequestError);
      await expect(emailUpdatePromise).rejects.toThrow('empty email for update');
      expect(validator.isValidEmail).not.toHaveBeenCalled();
    });

    it('same email', async () => {
      const VALID_EMAIL = 'testuser@logstuff.com';
      userRepo.getUser.mockImplementation(() => Promise.resolve({ email: VALID_EMAIL }));
      const emailUpdatePromise = updateUser(VALID_ID, {
        fields: ['email'], email: VALID_EMAIL,
      });
      await expect(emailUpdatePromise).rejects.toThrowError(BadRequestError);
      await expect(emailUpdatePromise).rejects.toThrowError('email must be different');
      expect(validator.isValidEmail).toHaveBeenCalled();
      expect(userRepo.getUser).toHaveBeenCalled();
    });

    it('successful email update', async () => {
      userRepo.getUser.mockImplementation(() => Promise.resolve({ email: 'testuser@logstuff.com' }));
      userRepo.updateUser.mockImplementation(() => Promise.resolve({}));
      const emailUpdatePromise = updateUser(VALID_ID, {
        fields: ['email'], email: 'testuser_updated@logstuff.com',
      });
      expect(await emailUpdatePromise).toBeDefined();
      expect(validator.isValidEmail).toHaveBeenCalled();
      expect(userRepo.getUser).toHaveBeenCalled();
      expect(userRepo.updateUser).toHaveBeenCalled();
    });
  });

  describe('password update', () => {
    it('empty password', async () => {
      const passUpdatePromise = updateUser(VALID_ID, { fields: ['password'] });
      await expect(passUpdatePromise).rejects.toThrowError(BadRequestError);
      await expect(passUpdatePromise).rejects.toThrow('empty password for update');
      expect(validator.isStrongPassword).not.toHaveBeenCalled();
    });

    it('same password', async () => {
      userRepo.getUserWithPassword.mockImplementation(() => Promise.resolve({ password: 'same_pass' }));
      crypto.comparePassword.mockImplementation(() => Promise.resolve(true));
      const passUpdatePromise = updateUser(VALID_ID, {
        fields: ['password'], password: 'same_pass',
      });
      await expect(passUpdatePromise).rejects.toThrowError(BadRequestError);
      await expect(passUpdatePromise).rejects.toThrow('password must be different');
      expect(validator.isStrongPassword).toHaveBeenCalled();
      expect(userRepo.getUserWithPassword).toHaveBeenCalled();
      expect(crypto.comparePassword).toHaveBeenCalled();
    });

    it('successful password update', async () => {
      userRepo.getUserWithPassword.mockImplementation(() => Promise.resolve({ password: 'old_pass' }));
      userRepo.updateUser.mockImplementation(() => Promise.resolve({}));
      crypto.comparePassword.mockImplementation(() => Promise.resolve(false));
      crypto.hashPassword.mockImplementation(() => Promise.resolve('hashed_pass'));
      const passUpdatePromise = updateUser(VALID_ID, {
        fields: ['password'], password: 'new_pass',
      });
      expect(await passUpdatePromise).toBeDefined();
      expect(validator.isStrongPassword).toHaveBeenCalled();
      expect(userRepo.getUserWithPassword).toHaveBeenCalled();
      expect(userRepo.updateUser).toHaveBeenCalled();
      expect(crypto.comparePassword).toHaveBeenCalled();
      expect(crypto.hashPassword).toHaveBeenCalled();
    });
  });
});
