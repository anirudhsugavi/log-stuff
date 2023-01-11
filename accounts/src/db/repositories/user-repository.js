const { User } = require('../../models');

async function createUser(user) {
  return User.create(user);
}

async function getUser(getQuery) {
  return User.findOne(getQuery).select('-password');
}

async function getUserPassword(getQuery) {
  return User.findOne(getQuery).select('password');
}

async function updateUser(filter, updateQuery) {
  return User.findOneAndUpdate(filter, updateQuery, { new: true, runValidators: true }).select('-password');
}

async function getAllUsers() {
  return User.find({});
}

module.exports = {
  createUser,
  getUser,
  getUserPassword,
  updateUser,
  getAllUsers,
};
