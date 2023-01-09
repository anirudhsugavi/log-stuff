const { User } = require('../../models');
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

async function updateUser(existingId, toUpdate) {
  logger.debug(`updating user '${existingId}'`, toUpdate);
  const user = await User.findByIdAndUpdate(existingId, toUpdate, { new: true });
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
