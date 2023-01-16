const userRepo = require('../db/repositories/user-repository');
const { BadRequestError, NotFoundError } = require('../util/app-errors');
const logger = require('../util/logger');
const validator = require('../validator');

async function getUser({ _id, email, username }, fetchPassword = false) {
  if (_id) {
    logger.debug('finding user by ID', { _id });
    validateInput({ _id });
    const user = await getUserHelper({ _id }, fetchPassword);
    if (!user) {
      throw new NotFoundError({ description: `user with ID '${_id}' does not exist` });
    }
    return user;
  }

  if (email) {
    logger.debug('finding user by email', { email });
    validateInput({ email });
    const user = await getUserHelper({ email }, fetchPassword);
    if (!user) {
      throw new NotFoundError({ description: `user with email '${email}' does not exist` });
    }
    return user;
  }

  if (username) {
    logger.debug('finding user by username', { username });
    validateInput({ username });
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
  validateInput({ _id });
  if (!fields || !Array.isArray(fields) || fields.length < 1) {
    throw new BadRequestError({ description: 'invalid update fields array' });
  }

  const queryPromises = [...new Set(fields)].map((field) => getUpdateQueryByField({
    _id, field, email, password, username, name, avatar, settings,
  }));

  const fieldQueries = await Promise.all(queryPromises);
  const updateQuery = getAggregatedSetAndUnsetQueries(fieldQueries);
  return userRepo.updateUser({ _id }, { $set: updateQuery.set, $unset: updateQuery.unset });
}

async function deleteUser({ _id, email, username }) {
  const deleteQuery = { $set: { deleted: true } };
  if (_id) {
    logger.debug('deleting user by ID', { _id });
    validateInput({ _id });
    const user = await userRepo.updateUser({ _id }, deleteQuery);
    if (!user) {
      throw new NotFoundError({ description: `user with ID '${_id}' does not exist` });
    }
    return user;
  }

  if (email) {
    logger.debug('deleting user by email', { email });
    validateInput({ email });
    const user = await userRepo.updateUser({ email }, deleteQuery);
    if (!user) {
      throw new NotFoundError({ description: `user with email '${email}' does not exist` });
    }
    return user;
  }

  if (username) {
    logger.debug('deleting user by username', { username });
    validateInput({ username });
    const user = await userRepo.updateUser({ username }, deleteQuery);
    if (!user) {
      throw new NotFoundError({ description: `user with username '${username}' does not exist` });
    }
    return user;
  }

  throw new BadRequestError({ description: 'user ID, email, or username is required' });
}

function validateInput(user) {
  logger.debug('validating user input');

  const {
    email, password, username, roles, _id,
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

  if (_id && !validator.isValidId(_id)) {
    throw new BadRequestError({ description: 'invalid ID' });
  }
}

async function getUserHelper(filter, fetchPassword) {
  return fetchPassword ? userRepo.getUserWithPassword(filter) : userRepo.getUser(filter);
}

async function getUpdateQueryByField({
  _id, field, email, password, username, name, avatar, settings,
}) {
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
      return getUsernameQuery(_id, username);
    case 'name':
      return getNameQuery(name);
    case 'settings':
      return getSettingsQuery(settings);
    case 'avatar':
      // todo
      avatar.trim();
      throw new BadRequestError({ description: 'avatar update coming soon' });
    default:
      throw new BadRequestError({ description: `invalid update user field '${field}'` });
  }
}

async function getUsernameQuery(_id, username) {
  validateInput({ username });

  const user = await userRepo.getUser({ _id });
  if (!user) {
    throw new BadRequestError({ description: 'user does not exist' });
  }

  const toUpdateUsername = (!username || !username.trim()) ? user.email : username;
  return { set: { username: toUpdateUsername }, unset: {} };
}

async function getNameQuery(name) {
  const namesToSet = {};
  const namesToUnset = {};
  if (!name) {
    throw new BadRequestError({ description: 'empty name for update' });
  }

  Object.entries(name).forEach(([key, val]) => {
    if (val === null || val.trim().length < 1) {
      namesToUnset[`name.${key}`] = val;
    } else {
      namesToSet[`name.${key}`] = val;
    }
  });

  return { set: namesToSet, unset: namesToUnset };
}

async function getSettingsQuery(settings) {
  const settingsToSet = {};
  const settingsToUnset = {};
  if (!settings) {
    throw new BadRequestError({ description: 'empty settings for update' });
  }

  Object.entries(settings).forEach(([key, val]) => {
    if (val === null || val.trim().length < 1) {
      settingsToUnset[`settings.${key}`] = val;
    } else {
      settingsToSet[`settings.${key}`] = val;
    }
  });

  return { set: settingsToSet, unset: settingsToUnset };
}

function getAggregatedSetAndUnsetQueries(fieldQueries) {
  return fieldQueries.reduce((acc, query) => {
    if (Object.keys(query.set).length > 0) {
      Object.assign(acc.set, query.set);
    }

    if (Object.keys(query.unset).length > 0) {
      Object.assign(acc.unset, query.unset);
    }

    return acc;
  }, { set: {}, unset: {} });
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
