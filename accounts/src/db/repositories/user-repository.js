const { User } = require('../../models');

async function createUser(user) {
  return User.create(user);
}

async function getUser(getQuery) {
  return User.findOne(getQuery);
}

async function updateUser(_id, updateQuery) {
  return User.findByIdAndUpdate(_id, updateQuery, { new: true, runValidators: true });
}

async function getAllUsers() {
  return User.find({});
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  getAllUsers,
};
