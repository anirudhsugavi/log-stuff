const { User } = require('../../models');

async function createUser(user) {
  return User.create(user);
}

async function getUser(getQuery) {
  const query = { ...getQuery, deleted: false };
  return User.findOne(query).select('-password');
}

async function getUserPassword(getQuery) {
  const query = { ...getQuery, deleted: false };
  return User.findOne(query);
}

async function updateUser(filter, updateQuery) {
  const filterQuery = { ...filter, deleted: false };
  return User.findOneAndUpdate(filterQuery, updateQuery, { new: true, runValidators: true }).select('-password');
}

module.exports = {
  createUser,
  getUser,
  getUserPassword,
  updateUser,
};
