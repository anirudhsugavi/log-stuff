const { User } = require('../../models');
const { NotFoundError } = require('../../util/app-errors');
const logger = require('../../util/logger');

async function createUser(user) {
  logger.debug('creating user', user);
  const result = await User.create(user);
  return result;
}

async function findUser({ _id, username, email }) {
  logger.debug('find userById', { _id, username, email });
  const user = await User.findById(_id);
  if (user == null) {
    throw new NotFoundError({ description: `user ${username ?? email} not found` });
  }
  return user;
}

async function updateUser(existing, toUpdate) {
  logger.debug('updating user', existing, toUpdate);
  const user = await User.findByIdAndUpdate(existing._id, toUpdate);
  if (user == null) {
    throw new NotFoundError({ description: `user ${existing.username ?? existing.email} not found` });
  }
  return user;
}

module.exports = {
  createUser, findUser, updateUser,
};
