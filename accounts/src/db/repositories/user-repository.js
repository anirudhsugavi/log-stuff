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

async function updateUser(filter, updateQuery, session) {
  return User.findOneAndUpdate([filter], updateQuery, { new: true, runValidators: true, session }).select('-password');
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
