const { User } = require('../../models');
const { NotFoundError } = require('../../util/app-errors');
const logger = require('../../util/logger');

async function createUser(user) {
  return User.create(user);
}

async function getUserById(_id) {
  return User.findById(_id);
}

async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function getUserByUsername(username) {
  return User.findOne({ username });
}

async function updateUser(existing, toUpdate) {
  // todo
  logger.debug('updating user', existing, toUpdate);
  const user = await User.findByIdAndUpdate(existing._id, toUpdate);
  if (user == null) {
    throw new NotFoundError({ description: `user ${existing.username ?? existing.email} not found` });
  }
  return user;
}

async function getAllUsers() {
  return User.find({});
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  getAllUsers,
};
