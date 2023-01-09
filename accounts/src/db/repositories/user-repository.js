const { User } = require('../../models');

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

async function updateUser(_id, updateQuery) {
  return User.findByIdAndUpdate(_id, updateQuery, { new: true, runValidators: true });
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
