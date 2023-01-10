const { userRepo } = require('../db/repositories');
const { BadRequestError, NotFoundError } = require('../util/app-errors');
const logger = require('../util/logger');
const validator = require('../validator');

async function getUser({ _id, email, username }, fetchPassword = false) {
  if (_id) {
    logger.debug('finding user by ID', { _id });
    validateId(_id);
    const user = await getUserHelper({ _id }, fetchPassword);
    if (!user) {
      throw new NotFoundError({ description: `user with ID '${_id}' does not exist` });
    }
    return user;
  }

  if (email) {
    logger.debug('finding user by email', { email });
    const user = await getUserHelper({ email }, fetchPassword);
    if (!user) {
      throw new NotFoundError({ description: `user with email '${email}' does not exist` });
    }
    return user;
  }

  if (username) {
    logger.debug('finding user by username', { username });
    const user = await getUserHelper({ username }, fetchPassword);
    if (!user) {
      throw new NotFoundError({ description: `user with username '${username}' does not exist` });
    }
    return user;
  }

  throw new BadRequestError({ description: 'user ID, email, or username is required' });
}

async function createUser(user) {
  validateInput(user);

  return userRepo.createUser(user);
}

async function updateUser(_id, {
  fields, email, password, username, name, avatar, settings,
}) {
  if (!fields || !Array.isArray(fields) || fields.length < 1) {
    throw new BadRequestError({ description: 'invalid update fields array' });
  }

  const updates = [...new Set(fields)].map((field) => {
    switch (field) {
      case 'email':
        // todo
        email.trim();
        throw new BadRequestError({ description: 'update email coming soon' });
      case 'password':
        // todo
        password.trim();
        throw new BadRequestError({ description: 'update password coming soon' });
      case 'username':
        return updateUsername(_id, username);
      case 'name':
        return updateUserFields(_id, name, getNameQuery);
      case 'settings':
        return updateUserFields(_id, settings, getSettingsQuery);
      case 'avatar':
        // todo
        avatar.trim();
        throw new BadRequestError({ description: 'avatar update coming soon' });
      default:
        throw new BadRequestError({ description: `invalid update user field '${field}'` });
    }
  });
  await Promise.all(updates);

  return userRepo.getUser({ _id });
}

function validateInput(user) {
  logger.debug('validating user input');

  const {
    email, password, username, roles,
  } = user;

  if (email && !validator.isValidEmail(email)) {
    throw new BadRequestError({ description: 'invalid email' });
  }

  if (password && !validator.isStrongPassword(password)) {
    throw new BadRequestError({ description: 'password does not meet requirements' });
  }

  if (username && !validator.isValidUsername(username)) {
    throw new BadRequestError({ description: 'special characters not allowed in username' });
  }

  if (roles && !validator.isValidRoles(roles)) {
    throw new BadRequestError({ description: 'invalid roles' });
  }
}

function validateId(id) {
  if (!validator.isValidId(id)) {
    throw new BadRequestError({ description: 'invalid ID' });
  }
}

async function getUserHelper(filter, fetchPassword) {
  return fetchPassword ? userRepo.getUserPassword(filter) : userRepo.getUser(filter);
}

async function updateUsername(_id, username) {
  validateInput({ username });
  const user = await userRepo.getUser({ _id });
  if (!user) {
    throw new BadRequestError('user does not exist');
  }

  if (username === user.username) {
    return user;
  }

  const toUpdateUsername = (!username || !username.trim()) ? user.email : username;

  return userRepo.updateUser({ _id }, { $set: { username: toUpdateUsername } });
}

async function updateUserFields(_id, updateObj, queryFn) {
  const [set, unset] = queryFn(updateObj);

  if (Object.keys(set).length > 0 && Object.keys(unset).length > 0) {
    const result = await Promise.all([
      userRepo.updateUser({ _id }, { $set: set }),
      userRepo.updateUser({ _id }, { $unset: unset }),
    ]);
    return Object.assign(...result);
  }

  if (Object.keys(set).length > 0) {
    return userRepo.updateUser({ _id }, { $set: set });
  }

  if (Object.keys(unset).length > 0) {
    return userRepo.updateUser({ _id }, { $unset: unset });
  }

  throw new BadRequestError({ description: 'empty object' });
}

function getNameQuery(name) {
  const partsToSet = {};
  const partsToUnSet = {};

  Object.entries(name).forEach(([key, val]) => {
    if (val === null || val.trim().length < 1) {
      partsToUnSet[`name.${key}`] = val;
    } else {
      partsToSet[`name.${key}`] = val;
    }
  });

  return [partsToSet, partsToUnSet];
}

function getSettingsQuery(settings) {
  const settingsToSet = {};
  const settingsToUnset = {};
  Object.entries(settings).forEach(([key, val]) => {
    if (val === null || val.trim().length < 1) {
      settingsToUnset[`settings.${key}`] = val;
    } else {
      settingsToSet[`settings.${key}`] = val;
    }
  });

  return [settingsToSet, settingsToUnset];
}

module.exports = {
  createUser,
  getUser,
  updateUser,
};
